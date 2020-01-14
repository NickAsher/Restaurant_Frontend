const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;



exports.getMenu = async (req, res)=>{


  try{
    let menuData = await dbRepository.getAllMenuItems_SeperatedByCategory() ;

    res.render('menu/menu.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      menuData : menuData['data'],
    }) ;

  }catch (e) {
    res.send(e) ;
  }
};


exports.getMenuDetail = async(req, res)=>{
  try{
    let categoryId = req.params.categoryId ;
    let itemId = req.params.itemId ;

    let itemData = await dbRepository.getSingleMenuItem(categoryId, itemId) ;
    let sizeData = await dbRepository.getSingleMenuItem_PriceData(categoryId, itemId) ;
    let addonData = await dbRepository.getAddonDataInCategory(categoryId) ;

    res.render('menu/item.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      itemData : itemData['data']['0'],
      sizeData : sizeData['data'] ,
      multipleSizes : sizeData['data'].length > 1,
      addonData : addonData['data'],
    }) ;
  } catch (e) {
    res.send(e) ;
  }
} ;

exports.getMenuDetail2 = async(req, res)=>{
  try{
    let categoryId = req.params.categoryId ;
    let itemId = req.params.itemId ;

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
    res.send(e) ;
  }
} ;




