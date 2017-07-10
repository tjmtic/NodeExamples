var express = require('express');
var router = express.Router();
var path    = require("path");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
  //res.redirect('/public/signup.html');
//  res.sendFile(path.join(__dirname+'/signup.html'));

});

module.exports = router;
