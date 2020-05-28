const AWS = require('aws-sdk');

// Set the region
AWS.config.loadFromPath('./secret/aws_credentials.json');

// Create sendEmail params



module.exports.sendResetPasswordMail = (userEmailAddress, passwordResetLink)=>{
  let params = {
    Destination: {
      ToAddresses: [
        userEmailAddress,
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
    Source: 'noreply.rafique.in@gmail.com', /* required */
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




module.exports.sendAccountVerificationLink = (userEmailAddress, accountVerificationLink)=>{
  let params = {
    Destination: {
      ToAddresses: [
        userEmailAddress,
      ]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `Thanks for signing up on Gagneja's <br><br>
                Click <a href='${accountVerificationLink}' >here</a> to activate your account`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: "Activate your Gagneja's Account"
      }
    },
    Source: 'noreply.rafique.in@gmail.com', /* required */
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



module.exports.sendOrderSuccessMail = (userEmailAddress, orderId, cart)=>{
  let params = {
    Destination: {
      ToAddresses: [
        userEmailAddress,
      ]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `Thank you for ordering at Gagneja's. Your order id is ${orderId} <br><br> ${cart}`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: "Gagneja's : Order Successfull "
      }
    },
    Source: 'noreply.rafique.in@gmail.com', /* required */
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

