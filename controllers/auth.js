const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const bcrypt = require('bcrypt') ;
const crypto =  require('crypto') ;
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken') ;

const CLIENT_ID = "730014109642-7rldv9agg9qp0avagkapdv9l4kocjt5e.apps.googleusercontent.com" ;
const client = new OAuth2Client(CLIENT_ID);


exports.getLoginPage = async(req, res)=>{
  try{
    res.render('login.hbs', {
    }) ;
  }catch (e) {
    res.send({
      e,
      yolo : "Beta ji koi to error hai"
    }) ;
  }
} ;


exports.postLoginPage = async (req, res)=>{
  try {
    let email = req.body.post_Email;
    let password = req.body.post_Password;

    let dbReturnData = await dbRepository.getUser_ByEmail(email);
    if (dbReturnData.status == false) {throw dbReturnData.data;}
    if (dbReturnData.data.length == 0) {throw `No such user in the database`;}

    let userData = dbReturnData.data['0']; // due the data structure

    let matched = await bcrypt.compare(password, userData.password_hash);
    if (!matched) {throw "Invalid password";}

    req.session.isLoggedIn = true ;
    req.session.userId = userData.id ;
    res.redirect('/') ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }


};

exports.getSignUpPage = async (req, res)=>{
  res.render('signup.hbs', {

  }) ;
} ;



exports.postSignUpPage = async (req,res)=>{
  try {
    let firstname = req.body.post_Firstname;
    let lastname = req.body.post_Lastname;
    let email = req.body.post_Email;
    let password = req.body.post_Password;
    let passwordAgain = req.body.post_PasswordAgain ;
    // TODO backend form validation here

    if(password != passwordAgain){
      throw "Two passwords are not equal" ;
    }

    let countData = await dbRepository.getCount_EmailId(email) ;
    if(countData.status == false){throw countData ;}
    if(countData.data.total != 0){
      throw "There already exists a user with email id, data is " + countData.data.total ;
    }

    let password_hash = await bcrypt.hash(password, 8);
    let dbData = await dbConnection.execute(`
    INSERT INTO users_table_new (email, password_hash, password_dev, firstname, lastname) VALUES (:email, :password_hash, :password, :firstname, :lastname) `, {
      email,
      password_hash,
      password,
      firstname,
      lastname
    }) ;

    //Initiate user session
    req.session.isLoggedIn = true ;
    req.session.userId = dbData['0'].insertId ;

    res.send({
      msg : "new user is added",
      dbData
    });

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }

};

exports.postSignUp_Google = async (req, res)=>{
  /* This method will be used for both logging in and signing up users through google login.
  So check if a user already exists. */
  try {

    let googleToken = req.body.post_idToken ;
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: CLIENT_ID,  // if multiple [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    let email = payload['email'] ;
    let firstname = payload['given_name'] ;
    let lastname = payload['family_name'] ;
    let googleId = payload['sub'] ;



    let dbReturnData = await dbRepository.getUser_ByEmail(email);
    if (dbReturnData.status == false) {
      throw dbReturnData.data;
    }
    if (dbReturnData.data.length == 0) {
      // new user, so add him

      let dbData = await dbConnection.execute(`
    INSERT INTO users_table_new (email, firstname, lastname, oauth_provider, oauth_id) VALUES (:email, :firstname, :lastname, :oauth_provider, :oauth_id) `, {
        email,
        firstname,
        lastname,
        oauth_provider: "google",
        oauth_id: googleId
      });

      //Initiate user session
      req.session.isLoggedIn = true;
      req.session.userId = dbData['0'].insertId;
      console.log("New user, signing up") ;
      res.send({
        status: true
      });
    } else {
    // user already exists
      let userData = dbReturnData.data['0']; // due the data structure
      req.session.isLoggedIn = true ;
      req.session.userId = userData.id ;
      console.log("User already exists logging in") ;
      res.send({
        status: true
      });
    }


  }catch (e) {
    console.log(e) ;
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }




} ;


exports.postSignUp_Facebook = async (req, res)=>{
  /* This method will be used for both logging in and signing up users through Facebook login.
  So check if a user already exists. */
  try {

    let facebookToken = req.body.post_idToken ;
    // no need to verify the token as it is already verified
    // when we got the additional user info like email, name, by making an api request.
    // So unlike google, we don't have to verify that access token is correct or not
    let email = req.body.post_Email;
    let firstname = req.body.post_Firstname ;
    let lastname = req.body.post_Lastname ;
    let facebookId = req.body.post_Id ;




    let dbReturnData = await dbRepository.getUser_ByEmail(email);
    if (dbReturnData.status == false) {
      throw dbReturnData.data;
    }
    if (dbReturnData.data.length == 0) {
      // new user, so add him

      let dbData = await dbConnection.execute(`
    INSERT INTO users_table_new (email, firstname, lastname, oauth_provider, oauth_id) VALUES (:email, :firstname, :lastname, :oauth_provider, :oauth_id) `, {
        email,
        firstname,
        lastname,
        oauth_provider: "facebook",
        oauth_id: facebookId
      });

      //Initiate user session
      req.session.isLoggedIn = true;
      req.session.userId = dbData['0'].insertId;
      console.log("New user, signing up") ;
      res.send({
        status: true
      });
    } else {
      // user already exists
      let userData = dbReturnData.data['0']; // due the data structure
      req.session.isLoggedIn = true ;
      req.session.userId = userData.id ;
      console.log("User already exists logging in") ;
      res.send({
        status: true
      });
    }


  }catch (e) {
    console.log(e) ;
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.signOut = async(req, res)=>{
  try{

    req.session.destroy() ;
    res.clearCookie('my_session_id') ;
    res.redirect('/') ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;



exports.getResetPasswordPage = async (req, res)=>{
  try {
    res.render('reset_password.hbs', {

    });
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postResetPassword = async (req, res)=>{
  try {
    let email = req.body.post_Email;
    let dbReturnData = await dbRepository.getUser_ByEmail(email);
    if (dbReturnData.status == false) {
      throw dbReturnData.data;
    }
    if (dbReturnData.data.length == 0) {
      // user does not exists. show error msg
      res.send({
        status: true,
        success: "NO_USER"
      });
      return;
    }
    let userData = dbReturnData.data['0']; // due the data structure
    let passwordHash = userData.password_hash;
    let randomString = crypto.randomBytes(32).toString('hex');
    let resetToken = jwt.sign({
      email: userData.email,
      random: randomString
    }, passwordHash, {expiresIn:'2h'}
    );

    let dbData = await dbRepository.resetPasswordToken(userData.id, resetToken);
    if (dbData.status == false) {
      throw dbData.data;
    }

    // TODO send the mail here
    res.send({
      status: true,
      success: "MAIL_SENT",
      link: `http://localhost:3000/resetPassword/${resetToken}`
    });

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }

} ;


exports.getResetPasswordTokenPage = async (req, res)=>{
  try{
    let resetToken = req.params.resetToken ;
    let dbReturnData = await dbRepository.getUser_ByResetToken(resetToken) ;
    if (dbReturnData.status == false) {throw dbReturnData.data;}
    if (dbReturnData.data.length == 0) {
      // token does not exist in db, invalid token
      throw "invalid token" ;
    }
    let userData = dbReturnData.data['0'] ;// due the data structure

    // will throw an error if token is not signed by password_hash
    // or if token has expired
    let decoded = jwt.verify(resetToken, userData.password_hash) ;
    if(decoded.email != userData.email){
      throw "invalid token : email is not same in token" ;
    }

    //our token is verified now, render the page
    res.render('reset_password_token', {
      resetToken,
      userId : userData.id
    }) ;






  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

exports.postResetPasswordToken = async (req, res)=>{
  try{
    let resetToken = req.body.post_resetToken ;
    let newPassword = req.body.post_newPassword ;
    let newPasswordAgain = req.body.post_newPasswordAgain ;

    if(newPassword != newPasswordAgain){throw "two passwords do not match" ;}

    let dbReturnData = await dbRepository.getUser_ByResetToken(resetToken) ;
    if (dbReturnData.status == false) {throw dbReturnData.data;}
    if (dbReturnData.data.length == 0) {
      // token does not exist in db, invalid token
      throw "invalid token" ;
    }
    let userData = dbReturnData.data['0'] ;// due the data structure

    let decoded = jwt.verify(resetToken, userData.password_hash) ;
    if(decoded.email != userData.email){
      throw "invalid token : email is not same in token" ;
    }

    let new_password_hash = await bcrypt.hash(newPassword, 8);
    let dbData = await dbConnection.execute(
        `UPDATE users_table_new SET password_hash = :new_password_hash,
         password_dev = :newPassword, reset_password_token = '' WHERE id = :id `, {
          new_password_hash,
          newPassword,
          id : userData.id
        }) ;


    res.send({
      status : true,
      success : "PWD_CHANGED"
    }) ;

  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;