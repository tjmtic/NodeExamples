var express = require('express');
var router = express.Router();

var passportConf = require('../config/passport');
var passport = require('passport');

var accountController = require('../controllers/account');


//LOGIN FORM ROUTES
/* GET users listing. */
router.get('/', passportConf.isAuthenticated);
router.get('/app', function(req,res,next) {


    var csrf =  res.locals._csrf;
    var sid =   req.session;
    var message = "success";
    res.send({csrf, sid, message});

});


router.get('/login', passportConf.isAuthenticated);

router.get('/signup', function(req, res, next) {
  res.send('respond with login resource');
});

router.get('/home', passportConf.isAuthenticated, function(req,res,next) {
    res.render('fiftyfifty', {
    user: req.user
  });
});

router.get('/app/home', passportConf.isAuthenticatedMobile, function(req,res,next) {
    var csrf =  res.locals._csrf;
    var sid =   req.session;
    var user = req.user;
    var message = "success";

    res.send({csrf, sid, user, message});

});


//LOGIN SETTING ROUTES
router.post('/login', accountController.login);
router.post('/app/login', accountController.appLogin);
router.post('/signup', accountController.signup);
router.get('/logout', accountController.logout);


router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.post('/app/auth/facebook', accountController.loginFB);


router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});




//USER CRUD OPERATIONS
//router.put('/create', accountController.update);
//router.get('/retrieve', accountController.update);
router.post('/update', accountController.update);
//router.delete('/delete', accountController.update);

module.exports = router;
