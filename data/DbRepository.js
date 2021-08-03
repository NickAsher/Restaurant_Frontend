const express = require('express') ;
const dbConnection  = require('../utils/DatabaseConnection') ;
const _ = require('lodash') ;




exports.getBlogCount = async() =>{
  try{
    let dbData = await dbConnection.execute(
      "SELECT COUNT(blog_id) AS cnt FROM blogs_table "
    ) ;
    return {
      status : true,
      data : dbData[0][0]['cnt']
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getBlogs_Paginated = async (pageNo, totalItemsPerPage)=>{
  try{
    let limit = totalItemsPerPage ;
    let offset = (pageNo-1)*totalItemsPerPage ;

    let dbData = await dbConnection.execute(
      `SELECT blog_id, blog_creation_date, blog_title, blog_display_image, blog_author 
        FROM  blogs_table ORDER BY blog_creation_date DESC LIMIT ${limit} OFFSET ${offset} `
    ) ;
    return {
      status : true,
      data : dbData[0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getSingleBlog = async (blogId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM  blogs_table WHERE blog_id =  ${blogId} `
    ) ;
    if(dbData[0].length != 1){throw "Blog Not found" ;}

    return {
      status : true,
      // the first 0 is for the because database data is sent in an array and is the 0th item,
      // the second is because even if we are getting one row, its still sent in an array form.
      // Its weird i know
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getAllGalleryItems = async ()=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM gallery_table ORDER BY gallery_item_sr_no ASC `
    ) ;
    return {
      status : true,
      data : dbData[0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getContactData = async ()=>{
  try {
    let dbData = await dbConnection.execute(
        `SELECT * FROM info_contact_table WHERE restaurant_id = 1`
    ) ;
    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getSocialData = async ()=>{
  try {
    let dbData = await dbConnection.execute(
        `SELECT * FROM info_social_table`
    ) ;
    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAboutData = async ()=>{
  try {
    let dbData = await dbConnection.execute(
        `SELECT * FROM info_about_table WHERE restaurant_id = 1`
    ) ;
    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;



exports.getOfferSpecialData = async ()=>{
  try {
    let dbData = await dbConnection.execute(
        `SELECT * FROM offer_special_table ORDER BY sr_no ASC `
    ) ;
    return {
      status : true,
      data : dbData[0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


/* ***************************************** User Data ************************************* */
exports.getUser_ByEmail = async(email)=>{
  try{
    let dbData = await dbConnection.execute(`
    SELECT * FROM users_table WHERE email = :userEmailId `, {
      userEmailId : email
    }) ;
    return {
      status : true,
      data : dbData[0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;

exports.getUser_ById = async(id)=>{
  try{
    let dbData = await dbConnection.execute(`
    SELECT * FROM users_table WHERE id = :id `, {
      id
    }) ;
    if(dbData[0].length != 1){throw "No such user in the database" ;}

    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;

exports.getUser_ByResetToken = async(resetToken)=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM users_table WHERE reset_password_token = :resetToken `, {
      resetToken
    }) ;
    if(dbData[0].length != 1){
      // token does not exist in db, invalid token
      throw "Invalid Token" ;
    }

    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;

exports.getUser_ByEmailVerificationToken = async(emailVerificationToken)=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM users_table WHERE email_verification_token = :emailVerificationToken `, {
        emailVerificationToken
      }) ;
    if(dbData[0].length != 1){
      // token does not exist in db, invalid token
      throw "Invalid Token" ;
    }

    return {
      status : true,
      data : dbData[0][0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;


exports.resetPasswordToken = async (id, resetToken)=>{
  try{
    let dbData = await dbConnection.execute(
        `UPDATE users_table SET reset_password_token = :resetToken WHERE id = :id `, {
          id,
          resetToken
        }) ;
    return {
      status : true,
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;

/* ************************** Order *******************************/


exports.insertOrder = async (orderData)=>{
  try{
    let dbData = await dbConnection.execute(
      `INSERT INTO order_table (userId, userDetails, address, cart, totalPrice, comments, paymentData)
       VALUES (:userId, :userDetails, :address, :cart, :totalPrice, :comments, :paymentData )`, {
        userId : orderData.userId,
        userDetails : orderData.userDetails,
        address : orderData.address,
        cart : orderData.cart,
        totalPrice : orderData.totalPrice,
        comments : orderData.comments,
        paymentData : orderData.paymentData
      }) ;
    return {
      status : true,
      data : dbData[0]
    } ;
  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;

exports.getOrderById = async (orderId, userId)=>{
  //although order can be retreived only by order id, we don't other users to see data of other user orders.
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM order_table WHERE id = :orderId AND userId = :userId`, {
        orderId,
        userId
      });

    return {
      status : true,
      data : dbData[0][0]
    } ;

  }catch (e) {
    return {
      status : false,
      error : e.toString()
    } ;
  }
} ;








/* ************************** Menu *******************************/

exports.getAllCategories = async ()=>{
  try{
    let dbData = await dbConnection.execute(
        "SELECT * FROM `menu_category_table` ORDER BY `category_sr_no` ASC") ;
    return {
      status : true,
      data : dbData[0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getAllMenuItems = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM menu_items_table
       WHERE item_is_active = '1'
       ORDER BY item_category_id ASC, item_sr_no ASC `
    ) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getSingleMenuItem = async (itemId)=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM menu_items_table, menu_category_table 
         WHERE menu_items_table.item_id = '${itemId}'
         AND menu_category_table.category_id = menu_items_table.item_category_id`
    ) ;
    return {
      status : true,
      data : dbData[0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }

} ;


exports.getSingleMenuItem_PriceData = async (itemId)=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT * FROM menu_meta_rel_size_items_table, menu_size_table 
         WHERE menu_meta_rel_size_items_table.item_id = '${itemId}'
         AND menu_meta_rel_size_items_table.size_id = menu_size_table.size_id
         AND menu_size_table.size_is_active = '1' AND menu_meta_rel_size_items_table.item_size_active = '1'
         ORDER BY menu_size_table.size_sr_no`
    ) ;
    return {
      status : true,
      data : dbData[0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getAllMenuItems_SeperatedByCategory = async ()=>{
  try{
    let dbCategoryData = await this.getAllCategories() ;
    if(dbCategoryData.status != true){throw dbCategoryData ;}

    let dbMenuData = await this.getAllMenuItems() ;
    if(dbMenuData.status != true ){throw dbMenuData ;}

    let categoryData = dbCategoryData.data ;
    let menuData = dbMenuData.data ;

    categoryData.forEach((categoryElement)=>{
      categoryElement.items = menuData.filter((menuItem)=>{
        return categoryElement.category_id == menuItem.item_category_id ;
      }) ;
    }) ;

    return {
      status : true,
      data : categoryData
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getAllAddonGroupsInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_addongroups_table
         WHERE category_id = '${categoryId}' AND addon_group_is_active = '1'
         ORDER BY addon_group_sr_no ASC `
    ) ;
    return {
      status : true,
      data : dbData[0],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getAllAddonItemsInAddonGroup = async (addonGroupId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_rel_size_addons_table, menu_addons_table 
        WHERE menu_addons_table.item_addon_group_rel_id =  ${addonGroupId}
        AND menu_meta_rel_size_addons_table.addon_id = menu_addons_table.item_id  
        AND addon_size_active = '1' AND item_is_active = '1' 
        ORDER BY item_sr_no ASC ` );

    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;


exports.getAddonDataInCategory = async (categoryId)=>{
  //TODO make a single request to get all addonItems in a cateogory.
  try{
    let categoryAddonGroupData = await this.getAllAddonGroupsInCategory(categoryId) ;
    categoryAddonGroupData = categoryAddonGroupData.data ;


    for(let i=0;i<categoryAddonGroupData.length; i++){
      let addonItemData = await this.getAllAddonItemsInAddonGroup(categoryAddonGroupData[i]['rel_id']) ;
      addonItemData = addonItemData['data'] ;

      addonItemData = addonItemData.reduce((result, currentObj)=>{
        if(result[currentObj['addon_id']] == null){
          result[currentObj['addon_id']] = [];
        }
        result[currentObj['addon_id']].push(currentObj);
        return result ;
      }, {}) ;

      categoryAddonGroupData[i]['addon_items_data'] = Object.values(addonItemData) ; // only keep the values of a key:value object and values are stored in an array structure
    }

    return {
      status : true,
      data : categoryAddonGroupData,
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;




exports.getAllSizes_NamesOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT size_id, size_name FROM menu_size_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAllAddonItems_NamesOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT item_id, item_name FROM menu_addons_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAllAddonGroups_NamesOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT rel_id, addon_group_display_name FROM menu_addongroups_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;

exports.getAllMenuItems_NameOnly = async()=>{
  try{
    let dbData = await dbConnection.execute(
      `SELECT item_id, item_name FROM menu_items_table `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      error : e,
    } ;
  }
} ;




