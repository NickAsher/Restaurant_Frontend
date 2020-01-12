const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const cookie = require('cookie') ;
exports.getHomePage = (req, res)=>{
  try{
    res.render('home/login.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      VIDEO_FRONTEND_LINK_PATH : Constants.VIDEO_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH

    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;

exports.postHomePage = (req, res)=>{
  try{
    res.setHeader('Set-Cookie', cookie.serialize('logged_in', true, {
      httpOnly : true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })) ;
    res.redirect('/menu') ;
  }catch (e) {
    res.send(e) ;
  }
} ;



