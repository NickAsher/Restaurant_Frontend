const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;

exports.getHomePage = (req, res)=>{
  try{
    res.render('home/home.hbs', {
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

  }catch (e) {
    res.send(e) ;
  }
} ;



