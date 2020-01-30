const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;
const parseUtils = require('../utils/parse') ;




exports.getContactUsData = async (req, res)=>{
  try{
    let contactData = await dbRepository.getContactData() ;
    if(contactData['status'] == false){throw contactData ;}

    let parsedCartData = parseUtils.getCart_Parsed(req.cookies.cart) ;
    if(parsedCartData.status == false){throw parsedCartData ;}

    res.render('contact.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items,
      contactData : contactData['data'],
      socialInfo : JSON.parse(contactData['data']['social_info']),
      cartData : parsedCartData.cartData,
      totalPrice : parsedCartData.totalPrice,
    }) ;

  }catch (e) {
    res.send(e) ;
  }
} ;

exports.getAboutUsData = async (req, res)=>{
  try {
    let aboutData = await dbRepository.getAboutData();
    if(aboutData.status == false){throw aboutData ;}

    let parsedCartData = parseUtils.getCart_Parsed(req.cookies.cart) ;
    if(parsedCartData.status == false){throw parsedCartData ;}

    res.render('about.hbs', {
      IMAGE_FRONTEND_LINK_PATH: Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH: Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS: req.cookies.total_items,
      aboutData: aboutData['data'],
      cartData : parsedCartData.cartData,
      totalPrice : parsedCartData.totalPrice,
    });
  }catch (e) {
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;

exports.getOfferSpecialsData = async (req, res)=>{
  try {
    let offersData = await dbRepository.getOfferSpecialData();
    if(offersData.status == false){throw offersData ;}

    let parsedCartData = parseUtils.getCart_Parsed(req.cookies.cart) ;
    if(parsedCartData.status == false){throw parsedCartData ;}

    res.render('offers.hbs', {
      IMAGE_FRONTEND_LINK_PATH: Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH: Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS: req.cookies.total_items,
      offersData: offersData['data'],
      cartData : parsedCartData.cartData,
      totalPrice : parsedCartData.totalPrice,
    });
  }catch (e) {
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;



exports.getAboutUsData_Old = async (req, res)=>{
  try{
    let requestData =   await request(Constants.API_ROOTH_PATH_NEW + "/about") ;
    if(requestData['status'] == false){
      throw new Error(requestData["error_msg"]) ;
    }
    let aboutUsData = JSON.parse(requestData)['data'] ;

    res.render('info/about_us.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items,
      ABOUT_US_IMAGE : Constants.IMAGE_BACKENDFRONT_LINK_PATH + aboutUsData['about_us_image'],
      ABOUT_US_CONTENT1 : aboutUsData['about_us1'],
      ABOUT_US_CONTENT2: aboutUsData['about_us2']
    }) ;


  }catch (e) {
    res.send(e) ;
  }
} ;

exports.getContactUsData_Old = async (req, res)=>{
  try{
    let requestData =   await request(Constants.API_ROOTH_PATH_NEW + "/contact") ;
    if(requestData['status'] == false){
      throw new Error(requestData["error_msg"]) ;
    }
    let contactUsData = JSON.parse(requestData)['data'] ;

    res.render('info/contact_us.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,

      RESTAURANT_NAME : contactUsData['restaurant_name'],
      RESTAURANT_IMAGE : Constants.IMAGE_BACKENDFRONT_LINK_PATH + contactUsData['restaurant_image'],
      RESTAURANT_LOGO: contactUsData['restaurant_logo'],
      RESTAURANT_ADDR1 : contactUsData['restaurant_addr_1'],
      RESTAURANT_ADDR2 : contactUsData['restaurant_addr_2'],
      RESTAURANT_ADDR3 : contactUsData['restaurant_addr_3'],
      RESTAURANT_PHONE: contactUsData['restaurant_phone'],
      RESTAURANT_EMAIL : contactUsData['restaurant_email'],
      RESTAURANT_HOURS : JSON.parse(contactUsData['restaurant_hours'])
    }) ;

  }catch (e) {
    res.send(e) ;
  }
} ;