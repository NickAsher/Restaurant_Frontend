const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;



const getAllGalleryItems = async (req, res)=>{
  try{
    let requestData =   await request(Constants.API_ROOTH_PATH_NEW + "/gallery")
    if(requestData['status'] == false){
      throw new Error(requestData["error_msg"]) ;
    }
    let galleryArray = JSON.parse(requestData)['data'] ;

    res.render('gallery/gallery.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      galleryArray
    }) ;
  }catch (e) {
    res.send(e) ;

  }
};


const getSpecificGalleryItem = async (req, res)=>{
  try{
    let galleryItemId = req.params.galleryItemId ;

    let requestData = await request(Constants.API_ROOTH_PATH_NEW + "/gallery/" + galleryItemId) ;
    if(requestData['status'] == false){
      throw new Error(requestData["error_msg"]) ;
    }

    let itemData = JSON.parse(requestData)['data'] ;

    res.render('gallery/specific_image.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,

      IMAGE_TITLE : itemData['gallery_item_title'],
      IMAGE_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH + itemData['gallery_item_image_name'],
      IMAGE_DESCRIPTION : itemData['gallery_item_description']
    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;


module.exports = {
  getAllGalleryItems,
  getSpecificGalleryItem,

} ;