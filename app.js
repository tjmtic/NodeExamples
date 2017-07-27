var _ = require('lodash');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var passport = require('passport');
var lusca = require('lusca');
var flash = require('express-flash');
var expressValidator = require('express-validator');

var MongoStore = require('connect-mongo/es5')(session);



var app = express();

dotenv.load({ path: '.env' });



/**
 * API keys and Passport configuration.
 */
var passportConf = require('./config/passport');


//Secure Server 1 Setup?
var https = require("https");


//MongoDB
var mongo = require('./databases/mongo');




//Socket 1 Setup
var io = require('socket.io')();
var server = require('http').createServer(app);
var port = process.env.PORT || 3001;
server.listen(port, function () {
  console.log('Server listening at some port %d', port);
});
io = require('socket.io')(server);


//Beginning of Chatting for Socket
var nsp = io.of("/0");

io.on('connection', function(socket){
  socket.on('chat message', function(msg){

//Middleware-ish re-creation of message
//could do other validation things here,
//or emit different messages depending on paylod
    var message = {
      user : msg.user,
      time : msg.time,
      value : msg.value
    };

    io.emit('chat message', message);
  });
});



//Redis 1 Setup ?Adapter
var redisAdapter = require('socket.io-redis');
var redis = require('redis');
//var pub = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, { return_buffers:true, auth_pass: process.env.REDIS_PASSWORD });
//var sub = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, { return_buffers:true, auth_pass: process.env.REDIS_PASSWORD });
//io.adapter( redisAdapter({pubClient: pub, subClient: sub}) );



//Email with SendGrid Setup
var EmailManager = require('./email/sendgrid');



var index = require('./routes/index');
var users = require('./routes/users');


/*
//MySQL 1 Setup
var mysql = require('mysql');
var connection;
app.use(function (req,res,next){

   connection = mysql.createConnection({
    host  : process.env.DB_HOST,
    user  : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  req.msqlCon = connection;
  next();
});
*/

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(expressValidator());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB || process.env.MONGOLAB_URI,
    autoReconnect: true
  }),
  resave: true,
  saveUninitialized: true
 } ));


 app.use(passport.initialize());
 app.use(passport.session());

 app.use(function(req, res, next) {
  if (req.path==='/' ) {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});



app.use('/', index);
app.use('/users', users);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
