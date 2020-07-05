const Constants = require('../utils/Constants') ;
const dbRepository = require('../data/DbRepository') ;
const logger = require('../middleware/logging') ;


exports.getHomePage = async (req, res)=>{
  try{
    res.render('index-video.hbs', {
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.status(500).render('error.hbs', {
      showBackLink : false,
      error : e
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
    res.status(500).render('error.hbs', {
      showBackLink : true,
      backLink : "/",
      error : e
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
    res.status(500).render('error.hbs', {
      showBackLink : true,
      backLink : "/",
      error : e
    }) ;
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
    res.status(500).render('error.hbs', {
      showBackLink : true,
      backLink : "/",
      error : e
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
    res.status(500).render('error.hbs', {
      showBackLink : true,
      backLink : "/",
      error : e
    }) ;
  }
} ;

exports.getOrderPage = async (req, res)=>{
  try{
    res.render('order_success.hbs') ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.status(500).render('error.hbs', {
      showBackLink : true,
      backLink : "/",
      error : e
    }) ;
  }
} ;






