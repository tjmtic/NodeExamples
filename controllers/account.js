
var _ = require('lodash');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const validator = require('validator');
const Stripe = require('stripe')(process.env.STRIPE_KEY);


exports.login = (req,res,next) => {

  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }


  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/users/login');
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });

      res.redirect('/users/home');

    });
  })(req, res, next);
};

exports.loginFB = (req, res) => {
  User.findOne({ facebook: req.body.facebook }).exec(function(err, existingUser) {
    if (err) {
      console.log("Error: " + err);
      res.json({'response':'failure', 'message': err});
    }
    if (existingUser) {
      existingUser.email = req.body.email;
      existingUser.first_name = req.body.first_name;
      existingUser.last_name = req.body.last_name;
      existingUser.device = req.body.device;
      existingUser.device_type = req.body.device_type;
      if (existingUser.customerId == "") {
            Stripe.customers.create({
              description: existingUser.first_name + " " + existingUser.last_name,
              email: existingUser.email,
            },function(err, customer) {
              if (err) {
                console.log(err);
                    res.json({'response': 'failure', 'message': err});
              }
                if(customer){
                  console.log(customer);
                  existingUser.customerId = customer.id;
                  existingUser.save(function(err){
                    if (err) {
                      console.log(err);
                      res.json({'response': 'failure', 'message': err});
                    } else {
                      res.json({'response':'success', 'user': existingUser });
                    }
                  });
                }
            });
      } else {
        existingUser.save(function(err){
          if (err) {
            console.log("Error: " + err);
            res.json({'response':'failure', 'message': err});
          } else {
            console.log("Saved user: " + existingUser);
            res.json({'response':'success', 'user': existingUser});
          }
        });
      }
    } else {
      console.log("Not existing user");
      const user = new User({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        facebook: req.body.facebook,
        device: req.body.device,
        device_type: req.body.device_type,
      });
      user.save(function(err){
        if (err) {
          console.log("Error: " + err);
          res.json({'response':'failure', 'message': err});
        } else {
          console.log("Saved user: " + user);
          res.json({'response':'success', 'user': user});
        }
      });
    }

  });
};




/**
 * POST /signup
 */
exports.signup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }

  var user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  //User.findOne({ email: req.body.email || username: req.body.username }, function(err, existingUser) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }

    User.findOne({ username: req.body.username }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that  username already exists.' });
        return res.redirect('/signup');
      }

        user.save(function(err) {
          if (err) {
            return next(err);
          }

          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }

            res.redirect('/new');

          });
        });
    });
  });
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  console.log("logout req....");
  console.log(req);
  console.log('logout req end.');
  req.logout();

  res.redirect('/');
};

exports.sendPasswordReset = function(req, res) {
  var store = res.locals.store;
  User.findOne({ email: req.body.email }).exec(function(err, user){
    if (err) {
      res.json({'response':'failure', 'message': err});
    }
    if (user) {
      var newPassword = user.first_name + Date.now();
      user.password = newPassword;
      req.EmailManager.sendTempPassword(store, user.first_name, user.email, newPassword);
      user.save(function(err){
        if (err) {
          res.json({'response':'failure', 'message': err});
        } else {
          res.json({'response':'success', 'user':user});
        }
      });
    } else {
      res.json({'response':'failure', 'message':'Email address not found.'});
    }
  });
}



exports.verifyUser = function(req, res, next) {
   User.findById(req.body.user_id).exec(function(err, user) {
    if (err) {
      console.log("Error: " + err);
      res.json({'response':'failure', 'message': err});
    }
    else if (!user) {
      res.json({'response':'failure', 'message': 'Email ${email} not found.'});
    } else {
      user.comparePassword(req.body.old_password, function(err, isMatch) {
        if (err) {
          console.log("Error: " + err);
          res.json({'response':'failure', 'message': err});
        } else if (isMatch) {
          next();
        } else {
          res.json({'response':'failure', 'message': 'Invalid email or password.'});
        }
      });
    }
  });
};



exports.resetPassword = function(req, res) {
  User.findById(req.body.user_id).exec(function(err, user){
    if (err) {
      res.json({'response':'failure', 'message': err});
    }
    if (user) {
      user.password = req.body.password;
      user.save(function(err){
        if (err) {
          res.json({'response':'failure', 'message': err});
        } else {
          res.json({'response':'success', 'user':user});
        }
      });
    }
  });
}




//CRUD: UPDATE Account
/**
 * POST /users/update
 */
exports.update = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    return res.json({'error': errors});
    //return res.redirect('/');
  }

User.findOne({ _id: req.user._id }, function(err, user) {
  //User.findOne({ email: req.body.email || username: req.body.username }, function(err, existingUser) {
  if(!user){
    return res.json({'error': 'Account Error.'});
  }
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if(err){
      return res.json({'error': err});
    }
    if (existingUser) {
      if(user._id == existingUser._id){}

      else{
        //req.flash('errors', { msg: 'Account with that email address already exists.' });
        //return res.render(error)
        return res.json({'error': 'Account with that email address already exists.'});
      }
    }

    User.findOne({ username: req.body.username }, function(err, existingUser2) {
          if(err){
            return res.json({'error': err});
          }
          if (existingUser2) {
            if(user._id == existingUser2._id){}

            else{
            //  req.flash('errors', { msg: 'Account with that username already exists.' });
            //  return res.redirect('/signup');
            return res.json({'error': 'Account with that username already exists.'});
            }
          }

          user.email= req.body.email;
          user.username= req.body.username;
          user.profile.website= req.body.website;
          user.profile.location= req.body.location;

          user.save(function(err) {
            if (err) {
              return res.json({'error': 'Saving Error'});
            }

            res.render('partials/account', {user:user});

          });
        });
    });
  });
};
