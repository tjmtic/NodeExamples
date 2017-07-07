'use strict';

const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const crypto = require('crypto');

class SendGridManager {

	var helper = require('sendgrid').mail;

	constructor() {
		console.log('Email manager online awaiting requests.');
	}

  sendEmail(title, name, to, message) {
    var body = '<html></html>';
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email(process.env.EMAIL);
    var to_email = new helper.Email(to);
    var subject = title;
    var content = new helper.Content('text/html', body);
    var mail = new helper.Mail(from_email, subject, to_email, content);

    mail.personalizations[0].addSubstitution(new helper.Substitution('-name-', name));
    mail.personalizations[0].addSubstitution(new helper.Substitution('-message-', message));
    mail.setTemplateId('88cf1932-742d-49a6-8ee6-11e3d79f703a');

    console.log("PROCESS API KEY" + process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
    sg.API(request, function(error, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
  }


}

var sendGridManager = new SendGridManager();
module.exports = sendGridManager;
