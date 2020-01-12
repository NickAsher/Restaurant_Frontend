const express = require('express') ;
const dbConnection  = require('./database') ;
const _ = require('lodash') ;


exports.getAllMenuCategories = async ()=>{
  try{
    let dbData = await dbConnection.execute(
        "SELECT * FROM `menu_meta_category_table` ORDER BY `category_id` ASC") ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;



exports.getSingleMenuCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM \`menu_meta_category_table\` WHERE \`category_id\` = ${categoryId} `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;

exports.getAllSubCategoryInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_subcategory_table WHERE category_id = '${categoryId}' ORDER BY subcategory_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;


exports.getSingleSubCategory = async (subcategoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_subcategory_table WHERE rel_id = '${subcategoryId}' `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;


exports.getAllAddonGroupsInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_addongroups_table WHERE category_id = '${categoryId}' ORDER BY addon_group_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;


exports.getSingleAddonGroup = async (addonGroupRelId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_addongroups_table WHERE rel_id = '${addonGroupRelId}' `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;


exports.getAllAddonItemsInAddonGroup = async (addonGroupRelId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_addons_table WHERE item_addon_group_rel_id = '${addonGroupRelId}' ORDER BY item_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;



exports.getSingleAddonItem = async (categoryId, addonItemId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_addons_table WHERE item_category_id = '${categoryId}' AND rel_id = '${addonItemId}' `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;



exports.getAllSizesInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_meta_size_table WHERE size_category_id = '${categoryId}' ORDER BY size_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;




exports.getAllMenuItemsInCategory = async (categoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_items_table WHERE item_category_id = '${categoryId}' ORDER BY item_id ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;

exports.getAllMenuItemsInSubCategory = async (subcategoryId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_items_table WHERE item_subcategory_rel_id = '${subcategoryId}' ORDER BY item_sr_no ASC `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;

//TODO change this method implementation as it uses more fields
exports.getSingleMenuItem = async (itemId)=>{
  try{
    let dbData = await dbConnection.execute(
        `SELECT * FROM menu_items_table WHERE item_id = '${itemId}'  `) ;
    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;

exports.getAllMenuItems_SeperatedByCategory2 = async (itemId)=>{
  try{
    let dbData = await dbConnection.execute(`SELECT * FROM menu_items_table`) ;
    dbData = dbData['0'] ;


    return {
      status : true,
      data : dbData['0'],
    } ;

  }catch (e) {
    return {
      status : false,
      data : e,
    } ;
  }

} ;


exports.getAllMenuItems_SeperatedByCategory = async ()=>{
  try{
    let categoryArray = await this.getAllMenuCategories() ;
    if(!categoryArray['status']){
      throw categoryArray['data'] ;
    }
    categoryArray = categoryArray['data'] ;
    for(let i=0;i<categoryArray.length; i++){
      let menuItemsInCategoryArray = await this.getAllMenuItemsInCategory(categoryArray[i]['category_id']) ;
      categoryArray[i]['items'] = menuItemsInCategoryArray['data'] ;
    }


    return {
      status : true,
      data : categoryArray,
    } ;

  }catch (e) {
    console.log(e) ;
    return {
      status : false,
      data : e,
    } ;
  }

} ;
