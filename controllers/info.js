const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;


exports.getHomePage = async (req, res)=>{
  try{
    res.render('index-video.hbs', {
    }) ;
  }catch (e) {
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
    res.send({
      e : e.toString(),
    }) ;
  }
} ;

exports.getOrderInfoPage = async (req, res)=>{
  try{
    if(!req.session.isLoggedIn){
      res.redirect('/login?redirect=order') ;
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
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;




