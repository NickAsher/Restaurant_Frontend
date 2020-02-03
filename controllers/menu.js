const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;


exports.getMenu = async (req, res)=>{
  try{
    let menuData = await dbRepository.getAllMenuItems_SeperatedByCategory() ;
    if(menuData.status == false){throw menuData.data ;}

    res.render('menu.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      menuData : menuData['data'],
    }) ;

  }catch (e) {
    res.send({
      e : e.message,
      msg : "Beta ji koi to error hai"
    }) ;
  }
};



exports.getItem_ModalProduct = async (req, res)=>{
  try {
    let categoryId = req.params.categoryId;
    let itemId = req.params.itemId;

    let itemData = await dbRepository.getSingleMenuItem(categoryId, itemId);
    if(itemData['status'] == false) {throw itemData ;}
    let sizeData = await dbRepository.getSingleMenuItem_PriceData(categoryId, itemId);
    if(sizeData['status'] == false) {throw sizeData ;}
    let addonData = await dbRepository.getAddonDataInCategory(categoryId);
    if(addonData['status'] == false) {throw addonData ;}

    res.render('./includes/modal_product.hbs', {
      IMAGE_FRONTEND_LINK_PATH: Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH: Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      itemData: itemData['data']['0'],
      sizeData: sizeData['data'],
      multipleSizes: sizeData['data'].length > 1,
      addonData: addonData['data'],
    });
  }catch (e) {
    res.send({
      e : e.message,
      msg : "Beta ji koi to error hai"
    }) ;  }

} ;




exports.getItemDetail_DataOnly = async(req, res)=>{
  try{
    let categoryId = req.params.categoryId || '1' ;
    let itemId = req.params.itemId || '41001' ;

    let itemData = await dbRepository.getSingleMenuItem(categoryId, itemId) ;
    let sizeData = await dbRepository.getSingleMenuItem_PriceData(categoryId, itemId) ;
    let addonData = await dbRepository.getAddonDataInCategory(categoryId) ;

    res.send({
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      itemData : itemData['data']['0'],
      sizeData : sizeData['data'] ,
      multipleSizes : sizeData['data'].length > 1,
      addonData : addonData['data'],
    }) ;
  } catch (e) {
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;






