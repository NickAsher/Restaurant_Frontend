const AWS = require('aws-sdk');
const Mailgen = require('mailgen') ;

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
          Data: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <!--<![endif]-->
    <!--[if (gte mso 9)|(IE)]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <!--[if (gte mso 9)|(IE)]>
    <style type="text/css">
        body {width: 600px;margin: 0 auto;}
        table {border-collapse: collapse;}
        table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
        img {-ms-interpolation-mode: bicubic;}
    </style>
    <![endif]-->
    <style type="text/css">
        body, p, div {
            font-family: inherit;
            font-size: 14px;
        }
        body {
            color: #000000;
        }
        body a {
            color: #1188E6;
            text-decoration: none;
        }
        p { margin: 0; padding: 0; }
        table.wrapper {
            width:100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        img.max-width {
            max-width: 100% !important;
        }
        .column.of-2 {
            width: 50%;
        }
        .column.of-3 {
            width: 33.333%;
        }
        .column.of-4 {
            width: 25%;
        }
        @media screen and (max-width:480px) {
            .preheader .rightColumnContent,
            .footer .rightColumnContent {
                text-align: left !important;
            }
            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
                text-align: left !important;
            }
            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
                font-size: 80% !important;
                padding: 5px 0;
            }
            table.wrapper-mobile {
                width: 100% !important;
                table-layout: fixed;
            }
            img.max-width {
                height: auto !important;
                max-width: 100% !important;
            }
            a.bulletproof-button {
                display: block !important;
                width: auto !important;
                font-size: 80%;
                padding-left: 0 !important;
                padding-right: 0 !important;
            }
            .columns {
                width: 100% !important;
            }
            .column {
                display: block !important;
                width: 100% !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
            }
        }
    </style>
    <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"><style>
    body {font-family: 'Muli', sans-serif;}
</style><!--End Head user entered-->
</head>
<body>
<center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
    <div class="webkit">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
            <tbody><tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left">
                    <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;" bgcolor="#f6f6f6">
                        <tbody>
                        <tr role="module-content">
                            <td height="100%" valign="top">
                                <table class="column" width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
                                    <tbody>
                                    <td style="padding:0px;margin:0px;border-spacing:0;">
                                        <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="d8508015-a2cb-488c-9877-d46adf313282">
                                            <tbody>
                                            <tr>
                                                <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                                                    <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="395" alt="" data-proportionally-constrained="true" data-responsive="false" src="https://s3.ap-south-1.amazonaws.com/rafique.in/restaurant-frontend/public/img/logo-horizontal-dark.png" >
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br><br>

                                        <div style="padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 43px">Reset Your Password&nbsp;</span></div><div></div></div></div>

                                        <div style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content">
                                            <div>
                                                <div style="font-family: inherit; text-align: center"><span style="font-size: 18px">We have received a password change request for your Gagneja's account . If you did not ask to change your password, then you can ignore this email and your password will not be changed. The link below will remain active for 12 hours. </span></div>
                                            </div>
                                            <br><br>
                                            <div align="center" bgcolor="#ffbe00" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                                                <a href="${passwordResetLink}" style="background-color:#ffbe00; border:1px solid #ffbe00; border-color:#ffbe00; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Reset password Now</a>
                                            </div>
                                            <br><br>
                                        </div>

                                    </td>
                                    </tr>
                                    </tbody>
                                </table>

                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div align="center" bgcolor="#f5f8fd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a href="https://www.rafique.in/" style="background-color:#f5f8fd; border:1px solid #f5f8fd; border-color:#f5f8fd; border-radius:25px; border-width:1px; color:#a8b9d5; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;" target="_blank">♥ This is a dev project by Rafique</a></div>

            </tr>
            </tbody>
        </table>
    </div>
</center>
</body>
</html>`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: "Reset your Gagneja's password"
      }
    },
    Source: 'noreply.accounts@gagneja.rafique.in', /* required */
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
          Data: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <!--<![endif]-->
    <!--[if (gte mso 9)|(IE)]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <!--[if (gte mso 9)|(IE)]>
    <style type="text/css">
        body {width: 600px;margin: 0 auto;}
        table {border-collapse: collapse;}
        table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
        img {-ms-interpolation-mode: bicubic;}
    </style>
    <![endif]-->
    <style type="text/css">
        body, p, div {
            font-family: inherit;
            font-size: 14px;
        }
        body {
            color: #000000;
        }
        body a {
            color: #1188E6;
            text-decoration: none;
        }
        p { margin: 0; padding: 0; }
        table.wrapper {
            width:100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        img.max-width {
            max-width: 100% !important;
        }
        .column.of-2 {
            width: 50%;
        }
        .column.of-3 {
            width: 33.333%;
        }
        .column.of-4 {
            width: 25%;
        }
        @media screen and (max-width:480px) {
            .preheader .rightColumnContent,
            .footer .rightColumnContent {
                text-align: left !important;
            }
            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
                text-align: left !important;
            }
            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
                font-size: 80% !important;
                padding: 5px 0;
            }
            table.wrapper-mobile {
                width: 100% !important;
                table-layout: fixed;
            }
            img.max-width {
                height: auto !important;
                max-width: 100% !important;
            }
            a.bulletproof-button {
                display: block !important;
                width: auto !important;
                font-size: 80%;
                padding-left: 0 !important;
                padding-right: 0 !important;
            }
            .columns {
                width: 100% !important;
            }
            .column {
                display: block !important;
                width: 100% !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
            }
        }
    </style>
    <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"><style>
    body {font-family: 'Muli', sans-serif;}
</style><!--End Head user entered-->
</head>
<body>
<center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
    <div class="webkit">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
            <tbody><tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left">
                    <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;" bgcolor="#f6f6f6">
                    <tbody>
                    <tr role="module-content">
                        <td height="100%" valign="top">
                            <table class="column" width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
                                <tbody>
                                    <td style="padding:0px;margin:0px;border-spacing:0;">
                                        <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="d8508015-a2cb-488c-9877-d46adf313282">
                                            <tbody>
                                                <tr>
                                                    <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                                                        <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="395" alt="" data-proportionally-constrained="true" data-responsive="false" src="https://s3.ap-south-1.amazonaws.com/rafique.in/restaurant-frontend/public/img/logo-horizontal-dark.png" >
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <br><br>

                                        <div style="padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 43px">Thanks for signing up&nbsp;</span></div><div></div></div></div>

                                        <div style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content">
                                            <div>
                                                <div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Please verify your email address to</span><span style="color: #000000; font-size: 18px; font-family: arial,helvetica,sans-serif"> start placing orders on the Gagneja's Website</span><span style="font-size: 18px">.</span></div>
                                                <br>
                                                <div style="font-family: inherit; text-align: center"><span style="color: #ffbe00; font-size: 18px"><strong>Thank you!&nbsp;</strong></span></div>
                                            </div>
                                            <br><br>
                                            <div align="center" bgcolor="#ffbe00" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                                                <a href=${accountVerificationLink} style="background-color:#ffbe00; border:1px solid #ffbe00; border-color:#ffbe00; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Verify Email Now</a>
                                            </div>
                                            <br><br>
                                        </div>

                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </td>
                    </tr>
                    </tbody>
                </table>
                <div align="center" bgcolor="#f5f8fd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a href="https://www.rafique.in/" style="background-color:#f5f8fd; border:1px solid #f5f8fd; border-color:#f5f8fd; border-radius:25px; border-width:1px; color:#a8b9d5; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;" target="_blank">♥ This is a dev project by Rafique</a></div>

            </tr>
            </tbody>
        </table>
    </div>
</center>
</body>
</html>`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: "Activate your Gagneja's Account"
      }
    },
    Source: 'noreply.accounts@gagneja.rafique.in', /* required */
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







module.exports.sendOrderSuccessMail = (userEmailAddress, orderId, userName, invoiceMailgenTable)=>{
  let mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
      // Appears in header & footer of e-mails
      name: 'Rafique.in',
      link: 'https://www.gagneja.rafique.in',
      logo: 'https://www.gagneja.rafique.in/img/logo-horizontal-dark.png'
    }
  }) ;


  let email = {
    body: {
      name: userName,
      intro: `Thank you for placing your order at Gagneja's. Your Order id is  "${orderId}"`,
      table: {
        data: invoiceMailgenTable,
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            item: '20%',
            price: '15%'
          },
          // Optionally, change column text alignment
          customAlignment: {
            price: 'right'
          }
        }
      },
      outro: 'Thank you for ordering with us. Your order will be delivered shortly'
    }
  };

// Generate an HTML email with the provided contents
  let emailBody = mailGenerator.generate(email);


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
          Data: emailBody
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: "Gagneja's : Order Successfull "
      }
    },
    Source: 'noreply.orders@gagneja.rafique.in', /* required */
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