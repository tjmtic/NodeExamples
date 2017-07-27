//MongoDB 1 Setup

var session = require('express-session');

var mongoose = require('mongoose');

var dotenv = require('dotenv');
dotenv.load({ path: '.env' });


class Mongo {

	constructor() {
    console.log('Mongo module connecting.');
    mongoose.connect(process.env.MONGODB || process.env.MONGO_URI);
    mongoose.connection.on('error', function(err) {
      console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
      console.log(err);
      process.exit(1);
		});

     }


}



var mongo = new Mongo();
module.exports = mongo;
