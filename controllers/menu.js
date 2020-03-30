const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../data/DbRepository') ;
const logger = require('../middleware/logging') ;


exports.getMenu = async (req, res)=>{
  try{
    let menuData = await dbRepository.getAllMenuItems_SeperatedByCategory() ;
    if(menuData.status == false){throw menuData ;}

    res.render('menu.hbs', {
      menuData : menuData['data'],
    }) ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
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

    let itemData = await dbRepository.getSingleMenuItem(itemId);
    if(itemData['status'] == false) {throw itemData ;}
    let sizeData = await dbRepository.getSingleMenuItem_PriceData(itemId);
    if(sizeData['status'] == false) {throw sizeData ;}
    let addonData = await dbRepository.getAddonDataInCategory(categoryId);
    if(addonData['status'] == false) {throw addonData ;}

    res.render('./includes/modal_product.hbs', {
      itemData: itemData['data']['0'],
      sizeData: sizeData['data'],
      multipleSizes: sizeData['data'].length > 1,
      addonData: addonData['data'],
    });
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      e : e.message,
      msg : "Beta ji koi to error hai"
    }) ;  }

} ;




exports.getItemDetail_DataOnly = async(req, res)=>{
  try{
    let categoryId = req.params.categoryId || '1' ;
    let itemId = req.params.itemId || '41001' ;

    let itemData = await dbRepository.getSingleMenuItem(itemId) ;
    let sizeData = await dbRepository.getSingleMenuItem_PriceData(itemId) ;
    let addonData = await dbRepository.getAddonDataInCategory(categoryId) ;

    res.send({
      itemData : itemData['data']['0'],
      sizeData : sizeData['data'] ,
      multipleSizes : sizeData['data'].length > 1,
      addonData : addonData['data'],
    }) ;
  } catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }
} ;






