'use strict';

const FB = require("firebase-admin");

//Your Key Here
const serviceAccount = require("YOUR_KEYFILE_HERE");

class Firebase {


	constructor() {
		console.log('Firebase module initilazing.');
		FB.initializeApp({
		  credential: FB.credential.cert(serviceAccount),
		  databaseURL: process.env.FIREBASE_URL
		});
	}
	sendNotification(token, title, content) {
		var payload = {
		  notification: {
		    title: title,
		    body: content
		  }
		};
		FB.messaging().sendToDevice(token, payload).then(function(response) {
		    console.log("Successfully sent message:", response);
		}).catch(function(error) {
		    console.log("Error sending message:", error);
		});
	}

	sendNotificationWithData(token, title, content, action, value) {
		var payload = {
		  notification: {
		    title: title,
		    body: content
			},
			data:{
				action: action,
				value: value
			}
		};
		FB.messaging().sendToDevice(token, payload).then(function(response) {
		    console.log("Successfully sent message:", response);
		}).catch(function(error) {
		    console.log("Error sending message:", error);
		});
	}
}
var fbManager = new Firebase();
module.exports = fbManager;
