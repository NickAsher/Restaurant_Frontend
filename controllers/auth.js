const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../data/DbRepository') ;
const bcrypt = require('bcrypt') ;
const crypto =  require('crypto') ;
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken') ;
const logger = require('../middleware/logging') ;
const emailUtils = require('../utils/email') ;

const CLIENT_ID = "730014109642-7rldv9agg9qp0avagkapdv9l4kocjt5e.apps.googleusercontent.com" ;
const client = new OAuth2Client(CLIENT_ID);


exports.getLoginPage = async(req, res)=>{
  try{
    res.render('login.hbs', {
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
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
    if (dbReturnData.status == false) {throw dbReturnData;}
    if (dbReturnData.data.length == 0) {throw `No such user in the database`;}

    let userData = dbReturnData.data['0']; // due the data structure

    let matched = await bcrypt.compare(password, userData.password_hash);
    if (!matched) {throw "Invalid password";}

    req.session.isLoggedIn = true ;
    req.session.userId = userData.id ;
    res.send({
      status : true,
      success : "USER_LOGGEDIN"
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status:false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }


};




exports.postSignUpPage = async (req,res)=>{
  try {
    let firstname = req.body.post_Firstname;
    let lastname = req.body.post_Lastname;
    let email = req.body.post_Email;
    let password = req.body.post_Password;

    //check whether a user with this email id already exists or not
    let dbExisitingUserData = await dbRepository.getUser_ByEmail(email) ;
    if(dbExisitingUserData.status == false){throw dbExisitingUserData ;}
    if(dbExisitingUserData.data.length != 0){throw "A user with this email address already exists" ;}


    let password_hash = await bcrypt.hash(password, 8);
    let dbData = await dbConnection.execute(`
    INSERT INTO users_table_new (email, password_hash, firstname, lastname) VALUES (:email, :password_hash, :firstname, :lastname) `, {
      email,
      password_hash,
      firstname,
      lastname
    }) ;

    //Initiate user session
    req.session.isLoggedIn = true ;
    req.session.userId = dbData[0].insertId ;

    res.send({
      status : true,
      success : "USER_ADDED"
    });

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
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
    if (dbReturnData.status == false) { throw dbReturnData; }
    if (dbReturnData.data.length == 0) {
      // new user, so add him

      //creating a fake password hash
      // needed for creating password reset jwt, as we use password hash to sign jwt. So password hash cannot be empty
      let fakePasswordHash = crypto.createHash('md5').update(`${googleId}-${email}`).digest('hex') ;
      let dbData = await dbConnection.execute(`
    INSERT INTO users_table_new (email, password_hash, firstname, lastname, oauth_provider, oauth_id) VALUES (:email, :password_hash, :firstname, :lastname, :oauth_provider, :oauth_id) `, {
        email,
        password_hash : fakePasswordHash,
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
        status: true,
        success : "USER_ADDED"
      });
    } else {
    // user already exists
      let userData = dbReturnData.data['0']; // due the data structure
      if(userData.oauth_provider != 'google'){throw "not a google account" ;}
      req.session.isLoggedIn = true ;
      req.session.userId = userData.id ;
      console.log("User already exists logging in") ;
      res.send({
        status: true,
        success : "USER_LOGGEDIN"
      });
    }


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;    res.send({
      status:false,
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
    if (dbReturnData.status == false) {throw dbReturnData;}
    if (dbReturnData.data.length == 0) {
      // new user, so add him

      //creating a fake password hash
      // needed for creating password reset jwt, as we use password hash to sign jwt. So password hash cannot be empty
      let fakePasswordHash = crypto.createHash('md5').update(`${facebookId}-${email}`).digest('hex')  ;

      let dbData = await dbConnection.execute(`
      INSERT INTO users_table_new (email, password_hash, firstname, lastname, oauth_provider, oauth_id) VALUES (:email, :password_hash, :firstname, :lastname, :oauth_provider, :oauth_id) `, {
        email,
        password_hash : fakePasswordHash,
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
        status: true,
        success : "USER_ADDED"
      });
    } else {
      // user already exists
      let userData = dbReturnData.data['0']; // due the data structure
      if(userData.oauth_provider != "facebook"){throw "Not a facebook account" ;}
      req.session.isLoggedIn = true ;
      req.session.userId = userData.id ;
      console.log("User already exists logging in") ;
      res.send({
        status: true,
        success : "USER_LOGGEDIN"
      });
    }


  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status:false,
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
    res.send({
      status : true
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status:false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;



exports.postForgotPassword = async (req, res)=>{
  //TODO check the working of this method, where we send status=true for no user found
  try {
    let email = req.body.post_Email;
    let dbReturnData = await dbRepository.getUser_ByEmail(email);
    if (dbReturnData.status == false) {throw dbReturnData;}
    if (dbReturnData.data.length == 0) {
      // user does not exists. show error msg
      // here status is true, because we are simply indicating that the request went through
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
      throw dbData;
    }

    // TODO send the mail here
    let passwordResetMailLink = `http://localhost:3000/resetPassword/${resetToken}` ;

    emailUtils.sendResetPasswordMail(passwordResetMailLink) ;

    res.send({
      status: true,
      success: "MAIL_SENT",
      link: `http://localhost:3000/resetPassword/${resetToken}`
    });

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status:false,
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
    if (dbReturnData.status == false) {throw dbReturnData;}

    let userData = dbReturnData.data ;

    // will throw an error if token is not signed by password_hash
    // or if token has expired
    let decoded = jwt.verify(resetToken, userData.password_hash) ;
    if(decoded.email != userData.email){throw "invalid token : email is not same in token" ;}

    //our token is verified now, render the page
    res.render('reset_password.hbs', {
      resetToken,
      userId : userData.id
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status:false,
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

    let dbReturnData = await dbRepository.getUser_ByResetToken(resetToken) ;
    if (dbReturnData.status == false) {throw dbReturnData;}

    let userData = dbReturnData.data ;

    let decoded = jwt.verify(resetToken, userData.password_hash) ;
    if(decoded.email != userData.email){throw "invalid token : email is not same in token" ;}

    let new_password_hash = await bcrypt.hash(newPassword, 8);
    let dbData = await dbConnection.execute(
        `UPDATE users_table_new SET password_hash = :new_password_hash,
        reset_password_token = '' WHERE id = :id `, {
          new_password_hash,
          newPassword,
          id : userData.id
        }) ;


    res.send({
      status : true,
      success : "PWD_CHANGED"
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status:false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;