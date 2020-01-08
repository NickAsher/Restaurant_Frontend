const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;


const getContactUsData = async (req, res)=>{
  try{
    let requestData =   await request(Constants.API_ROOTH_PATH_NEW + "/contact")
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



const getAboutUsData = async (req, res)=>{
  try{
    let requestData =   await request(Constants.API_ROOTH_PATH_NEW + "/about")
    if(requestData['status'] == false){
      throw new Error(requestData["error_msg"]) ;
    }
    let aboutUsData = JSON.parse(requestData)['data'] ;

    res.render('info/about_us.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,

      ABOUT_US_IMAGE : Constants.IMAGE_BACKENDFRONT_LINK_PATH + aboutUsData['about_us_image'],
      ABOUT_US_CONTENT1 : aboutUsData['about_us1'],
      ABOUT_US_CONTENT2: aboutUsData['about_us2']
    }) ;


  }catch (e) {
    res.send(e) ;
  }
} ;

module.exports = {
  getAboutUsData,
  getContactUsData
} ;