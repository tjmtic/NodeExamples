var express = require('express');
var router = express.Router();
var path    = require("path");


/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req);
  res.render('login');
  //res.redirect('/public/signup.html');
//  res.sendFile(path.join(__dirname+'/signup.html'));

});

router.post('/firebase/send', function(req,res,next){

    var token = req.body.device_id;
    var title = req.body.title;
    var content = req.body.content;
    req.fbManager.sendNotification(token, title, content);

    res.json({"message":"success"});

});

module.exports = router;
