var express = require('express');
var router = express.Router();
var path    = require("path");

var ScotchUser = require("../models/ScotchUser")


/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req);
  res.render('login-material');
  //res.redirect('/public/signup.html');
//  res.sendFile(path.join(__dirname+'/signup.html'));

});

/* Location Test Page. */
router.get('/test', function(req, res, next) {
  //console.log(req);
  res.render('scotchlayout');
  //res.redirect('/public/signup.html');
  //res.sendFile(path.join(__dirname+'/scotchlocation.html'));

});


router.get('/test/scotchUsers', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = ScotchUser.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

    // Provides method for saving new users in the db
router.post('/test/scotchUsers', function(req, res){

            // Creates a new User based on the Mongoose schema and the post bo.dy
            var newuser = new ScotchUser(req.body);

            // New User is saved in the db.
            newuser.save(function(err){
                if(err)
                    res.send(err);

                // If no errors are found, it responds with a JSON of the new user
                res.json(req.body);
            });
        });


router.post('/firebase/send', function(req,res,next){

    var token = req.body.device_id;
    var title = req.body.title;
    var content = req.body.content;
    req.fbManager.sendNotification(token, title, content);

    res.json({"message":"success"});

});

module.exports = router;
