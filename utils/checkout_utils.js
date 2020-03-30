const dbRepository = require('../data/DbRepository') ;
let dbConnection = require('./database') ;

let calculateItemPrice = async (backendCartItem)=>{
  /* an item is like this
  {
    "item_id":41002,
    "item_size_id":2,
    "item_quantity":1,
    "item_addon":[
      {"addon_group_id":1,"addon_items_array":[48005, 48007]},
      {"addon_group_id":2,"addon_items_array":[48001]}
    ]
  }
   * we will generally make two database requests for each cartItem
   * one to get the base item price from item_size_price_table
   * and then for second request, we firstly get all the addons in an array
   *    and then get the price for all those addon items in a single db request. So for above example item
   *    we get price for all the items [48005, 48006, 48001] in a single request on addon_size_price_table
   */
  let itemId = backendCartItem.item_id ;
  let itemSize = backendCartItem.item_size_id ;
  let dbItemData = await dbConnection.execute(`SELECT * FROM menu_meta_rel_size_items_table
   WHERE item_id = :itemId AND size_id = :itemSize`, {
    itemId,
    itemSize
  }) ;
  let itemPrice = parseFloat(dbItemData['0']['0']['item_price']) ;



  let addonItems = [] ;
  backendCartItem.item_addon.forEach((element, index)=>{
    if(element.addon_items_array.length!= 0){
      addonItems.push(element.addon_items_array) ;
    }
  }) ;

  // no point in making another request for addon items if there are no addon items for the selected item
  if(addonItems.length == 0){
    return itemPrice ;
  }

  let addonIds = addonItems.join(',') ;
  let dbAddonData = await dbConnection.execute(`
    SELECT * FROM  menu_meta_rel_size_addons_table
    WHERE size_id = :itemSize AND addon_id IN (${addonItems.join(',')}) `,{
    itemSize
  }) ;

  let dataRows = dbAddonData['0'] ;
  dataRows.forEach((element, index)=>{
    itemPrice += parseFloat(element.addon_price) ;
  }) ;
  return itemPrice ;
} ;



exports.calculateCartPrice = async (backendCart)=>{
  let totalPrice =  0 ;
  for(let i=0;i<backendCart.length; i++){
    totalPrice += await calculateItemPrice(backendCart[i]) ;
  }
  return totalPrice ;
} ;
