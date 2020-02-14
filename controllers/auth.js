const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const dbConnection = require('../utils/database') ;
const dbRepository = require('../utils/DbRepository') ;
const bcrypt = require('bcrypt') ;

exports.getLoginPage = async(req, res)=>{
  try{
    res.render('login.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      VIDEO_FRONTEND_LINK_PATH : Constants.VIDEO_FRONTEND_LINK_PATH,

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

    req.session.loggedIn = true ;
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
    IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
    IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    VIDEO_FRONTEND_LINK_PATH : Constants.VIDEO_FRONTEND_LINK_PATH,
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
    req.session.loggedIn = true ;
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