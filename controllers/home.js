const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const cookie = require('cookie') ;
const parseUtils = require('../utils/parse') ;





exports.getHomePage = async (req, res)=>{
  try{
    let parsedCartData = parseUtils.getCart_Parsed(req.cookies.cart) ;
    if(parsedCartData.status == false){throw parsedCartData ;}

    res.render('index-video.hbs', {
      TOTAL_CART_ITEMS : req.cookies.total_items,
      cartData : parsedCartData.cartData,
      totalPrice : parsedCartData.totalPrice,
    }) ;
  }catch (e) {
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }

} ;


exports.getHomePage_old = (req, res)=>{
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

exports.postHomePage_old = (req, res)=>{
  try{
    res.cookie('logged_in', true, {httpOnly : true, maxAge : 60*60*24*7 }) ;
    res.cookie('cart', '[]', {httpOnly : true, maxAge : 60*60*24*7 }) ;
    res.cookie('total_items', 0, {httpOnly : true, maxAge : 60*60*24*7 }) ;

    res.redirect('/menu') ;
  }catch (e) {
    res.send(e) ;
  }
} ;



