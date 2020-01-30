const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;
const parseUtils = require('../utils/parse') ;


exports.getMenu = async (req, res)=>{
  try{
    let menuData = await dbRepository.getAllMenuItems_SeperatedByCategory() ;
    if(menuData.status == false){throw menuData ;}

    let parsedCartData = parseUtils.getCart_Parsed(req.cookies.cart) ;
    if(parsedCartData.status == false){throw parsedCartData ;}

    res.render('menu.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items || '0',
      menuData : menuData['data'],
      cartData : parsedCartData.cartData,
      totalPrice : parsedCartData.totalPrice,
    }) ;

  }catch (e) {
    res.send({
      e : e.message,
      msg : "Beta ji koi to error hai"
    }) ;
  }
};




/*
 * Add an item to cart
 * and then show the menu page
 */
exports.postMenu = async (req, res)=>{
  try{
    let itemId = req.body.post_ItemId ;
    let itemQuantity = req.body.post_ItemQuantity ;
    let categoryId = req.body.post_CategoryId ;
    let itemName = req.body.post_ItemName ;
    let itemSizeData = JSON.parse(req.body.post_SizeData) ;

    let addonData = [] ;
    let addonGroupData = await dbRepository.getAllAddonGroupsInCategory(categoryId) ;
    if(addonGroupData['status' == false]){
      throw addonGroupData ;
    }
    addonGroupData = addonGroupData['data'];
    addonGroupData.forEach((obj)=>{
      let addonGroupId = obj['rel_id'] ;
      let addonGroupPostData = req['body']['__addongroup_id_' + addonGroupId] ;
      if(addonGroupPostData){

        let parsedData = [] ;
        addonGroupPostData.forEach((str)=>{
          // str here is data of each item

          parsedData.push(JSON.parse(str)) ;
        }) ;

        addonData.push({
          "addongroupId" : addonGroupId,
          "addongroupName" : obj['addon_group_display_name'],
          "addon_items_array" : parsedData
        }) ;
      }

    }) ;

    let itemData = {
      categoryId,
      itemId,
      itemName,
      itemQuantity,
      itemSizeData,
      addonData
    } ;
    let cart = JSON.parse(req.cookies.cart );
    cart.push(itemData) ;
    res.cookie('cart', JSON.stringify(cart)) ;

    let totalItems = parseInt(req.cookies.total_items) ;
    totalItems = totalItems + parseInt(itemQuantity) ;
    res.cookie('total_items', totalItems) ;

    // res.send({data : "kar diti processing"}) ;
    res.redirect('/menu') ;

  }catch (e) {
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai",
      body : req.body,
    }) ;
    // return this.getMenu(req, res) ;
  }

} ;



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
      TOTAL_CART_ITEMS: req.cookies.total_items || '0',
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
      TOTAL_CART_ITEMS : req.cookies.total_items || '0',
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

exports.getCart_DataOnly = async (req, res)=>{
  try{
    res.send({
      total_items : req.cookies.total_items || '0',
      cart : JSON.parse(req.cookies.cart || '[]') ,
    }) ;
  }catch (e) {
    res.send({
      "cart" : req.cookies.cart,
      e : e.toString(),
      msg : "Beta ji kyu to error hai",

  }) ;
  }
} ;






