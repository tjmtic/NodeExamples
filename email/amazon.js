var http = require('http');
var https = require('https');
const aws = require('aws-sdk');
aws.config.update({region:'us-west-1'});
const fs = require('fs');
var request = require('request');


const S3_BUCKET = process.env.S3_BUCKET;


exports.s3MetaDataTransform = function(req,res,next){

    var file = req.file;
    file.filename = Date.now();
    req.file = file;
    next();
};


exports.filerename = function(req,res,next){
  var file = req.file;
/////////////////
  //var type = req.body.type (category)
  file.filename = req.body.storeId + "/" + Date.now();
  ////////and so on, with mroe details
  req.file = file;
  next();
}

////////////
////prepares bucket for file stream
///////////
exports.s3signin = function(req,res,next){

const file = req.file;
  const s3 = new aws.S3({
    signatureVersion: 'v4'
  });
  const fileName = file.filename;//req.query['file-name'];
  const fileType = file.mimetype;//req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+fileName
    };
    console.log(returnData);
    res.locals.data = returnData;
    req.session.data = returnData;
    next();

  });
}

///////////////////
////Streams file to bucket
/////////////////
  exports.s3stream = function (req,res,next){
    var file = req.file;
    var stats = fs.statSync(file.path);
    ////////////
    fs.createReadStream(file.path).pipe(request({
      method: 'PUT',
      url: res.locals.data.signedRequest,
      headers: {
        'Content-Length': stats['size']
      }
      }, function (err, res, body) {
      console.log(body);
    }));
    res.json({'response':'success', code:'0', 'image':res.locals.data.url});
  };

  exports.s3streamNext = function (req,res,next){
    var file = req.file;
    var stats = fs.statSync(file.path);
    ////////////
    fs.createReadStream(file.path).pipe(request({
      method: 'PUT',
      url: res.locals.data.signedRequest,
      headers: {
        'Content-Length': stats['size']
      }
      }, function (err, res, body) {
      console.log(body);
    }));
    //res.json({'response':'success', code:'0', 'image':res.locals.data.url});
    next();
  };


  exports.s3send = function (req,res,next){


      var signedRequest = res.locals.data.signedRequest;
        console.log(signedRequest);
        var pathString = signedRequest.split(".com/");
        var pathString1 = pathString[1];
        console.log(pathString1);

    var options2 = {
        host: S3_BUCKET+'.s3.amazonaws.com',
        //host: signedRequest,
      //  port: 443,
        //path:  signedRequest,
        path: '/'+pathString1,
        method: 'PUT',
        //rejectUnauthorized: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'//,
          //'Content-Length': Buffer.byteLength(req.file)
        }
      };
      var xhr2 = https.request(options2, function(resp2) {
        resp2.setEncoding('utf8');
        resp2.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
          var response = JSON.parse(chunk);
          //const response = JSON.parse(xhr.responseText);
          console.log("Success" + response);
          if (response.status === 200){
            const responseText = JSON.parse(response.responseText);
      console.log("res code 0");
       res.json({'response':'success', code:'0', 'image':responseText.url});
     }
     else{
       console.log("res code 1");

        res.json({'response':'failure', code:'1'});

     }
      });
      resp2.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        console.log("res code 2");

         res.json({'response':'failure', code:'2'});

      });
    });
    xhr2.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      console.log("res code 4");

       res.json({'response':'failure', code:'4'});
    });
    xhr2.write(JSON.stringify(req.file));
    xhr2.end();
  }
