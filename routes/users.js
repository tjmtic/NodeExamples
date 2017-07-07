var express = require('express');
var router = express.Router();

var accountController = require('../controllers/account');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', accountController.login);

router.post('/signup', accountController.signup);

module.exports = router;
