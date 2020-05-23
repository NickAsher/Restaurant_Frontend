const AWS = require('aws-sdk');

// Set the region
AWS.config.loadFromPath('./secret/aws_credentials.json');

// Create sendEmail params



module.exports.sendResetPasswordMail = (passwordResetLink)=>{
  let params = {
    Destination: {
      ToAddresses: [
        'tuzumk@gmail.com',
      ]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `Click <a href='${passwordResetLink}' >here</a> to reset your password`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: "Reset your Gagneja's password"
      }
    },
    Source: 'pluzumk@gmail.com', /* required */
    ReplyToAddresses: [
      /* more items */
    ],
  };


  new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise()
    .then(
      function(data) {
        console.log("Mail is sent to SES serivce and message id is ", data.MessageId);
      }).catch(
    function(err) {
      console.error(err, err.stack);
    });
} ;

