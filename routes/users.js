var express = require('express');
var router = express.Router();

var passportConf = require('../config/passport');

var accountController = require('../controllers/account');

/* GET users listing. */
router.get('/', passportConf.isAuthenticated);
router.get('/login', passportConf.isAuthenticated);

router.get('/signup', function(req, res, next) {
  res.send('respond with login resource');
});

router.get('/home', passportConf.isAuthenticated, function(req,res,next) {
    res.render('index', {
    user: req.user
  });
});

router.post('/login', accountController.login);

router.post('/signup', accountController.signup);

module.exports = router;
