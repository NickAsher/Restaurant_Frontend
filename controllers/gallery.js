const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;
const parseUtils = require('../utils/parse') ;





exports.getAllGalleryItems = async (req, res)=>{
  try{
    let galleryData = await dbRepository.getAllGalleryItems() ;
    if(galleryData['status'] == false){throw galleryData ;}

    let parsedCartData = parseUtils.getCart_Parsed(req.cookies.cart) ;
    if(parsedCartData.status == false){throw parsedCartData ;}

    res.render('gallery.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items || '0',
      galleryData: galleryData['data'],
      cartData : parsedCartData.cartData,
      totalPrice : parsedCartData.totalPrice,
    }) ;
  }catch (e) {
    res.send({
      e : e.toString(),
    }) ;
  }

} ;




