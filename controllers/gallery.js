const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;





exports.getAllGalleryItems = async (req, res)=>{
  try{
    let galleryData = await dbRepository.getAllGalleryItems() ;
    if(galleryData['status'] == false){throw galleryData ;}

    res.render('gallery.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      signedIn : req.session.isLoggedIn,
      galleryData: galleryData['data'],
    }) ;
  }catch (e) {
    res.send({
      e : e.toString(),
    }) ;
  }

} ;




