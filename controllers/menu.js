const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;



exports.getMenu = async (req, res)=>{


  try{
    let menuData = await dbRepository.getAllMenuItems_SeperatedByCategory() ;

    res.render('menu/menu.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items,
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
      TOTAL_CART_ITEMS : req.cookies.total_items,
      itemData : itemData['data']['0'],
      sizeData : sizeData['data'] ,
      multipleSizes : sizeData['data'].length > 1,
      addonData : addonData['data'],
    }) ;
  } catch (e) {
    res.send(e) ;
  }
} ;

/*
 * Add an item to cart
 * and then show the menu page
 */
exports.postMenu = async (req, res)=>{
  try{
    let itemId = req.body.post_ItemId ;
    let itemQuantity = req.body.post_ItemQuantity ;
    let itemSizeId = req.body.post_SizeId ;
    let categoryId = req.body.post_CategoryId ;
    let addonData = [] ;
    let addonGroupData = await dbRepository.getAllAddonGroupsInCategory(categoryId) ;
    addonGroupData = addonGroupData['data'];
    addonGroupData.forEach((obj)=>{
      let addonGroupId = obj['rel_id'] ;
      let addonGroupPostData = req['body']['__addongroup_id_' + addonGroupId] ;
      addonData.push({
        "addongroupId" : addonGroupId,
        "addon_items_array" : addonGroupPostData
      }) ;
    }) ;

    let itemData = {
      itemId,
      itemQuantity,
      itemSizeId,
      categoryId,
      addonData
    } ;
    let cart = JSON.parse(req.cookies.cart );
    cart.push(itemData) ;
    res.cookie('cart', JSON.stringify(cart)) ;

    let totalItems = parseInt(req.cookies.total_items) ;
    totalItems = totalItems + parseInt(itemQuantity) ;
    res.cookie('total_items', totalItems) ;


    res.redirect('/menu') ;

  }catch (e) {
    res.send(e) ;
    // return this.getMenu(req, res) ;
  }

} ;

exports.getCart = async (req, res)=>{
  try{
    res.send({
      total_items : req.cookies.total_items,
      cart : JSON.parse(req.cookies.cart),
    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;






