const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../data/DbRepository') ;
const logger = require('../middleware/logging') ;


exports.getHomePage = async (req, res)=>{
  try{
    res.render('index-video.hbs', {
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;


exports.getAboutUsData = async (req, res)=>{
  try {
    let aboutData = await dbRepository.getAboutData();
    if(aboutData.status == false){throw aboutData ;}

    res.render('about.hbs', {
      aboutData: aboutData['data'],
    });
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;


exports.getContactUsData = async (req, res)=>{
  try{
    let contactData = await dbRepository.getContactData() ;
    if(contactData['status'] == false){throw contactData ;}

    res.render('contact.hbs', {
      contactData : contactData['data'],
      socialInfo : JSON.parse(contactData['data']['social_info']),
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send(e) ;
  }
} ;



exports.getOfferSpecialsData = async (req, res)=>{
  try {
    let offersData = await dbRepository.getOfferSpecialData();
    if(offersData.status == false){throw offersData ;}

    res.render('offers.hbs', {
      offersData: offersData['data'],
    });
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;


exports.getAllGalleryItems = async (req, res)=>{
  try{
    let galleryData = await dbRepository.getAllGalleryItems() ;
    if(galleryData['status'] == false){throw galleryData ;}

    res.render('gallery.hbs', {
      galleryData: galleryData['data'],
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      e : e.toString(),
    }) ;
  }
} ;

exports.getOrderPage = async (req, res)=>{
  try{
    res.render('order_success.hbs') ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;


exports.getOrderInfoPage = async (req, res)=>{
  try{
    if(!req.session.isLoggedIn){
      res.redirect('/login?redirect=order') ;
      return ;
    }
    //now the user is loggedIn
    let orderId = req.params.orderId ;
    let dbReturnData = await dbRepository.getOrderById(orderId, req.session.userId);
    if(dbReturnData.status == false){throw "Error in getting order info" ;}

    let orderData = dbReturnData.data ;
    res.render('order_success.hbs', {
      orderData
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;




