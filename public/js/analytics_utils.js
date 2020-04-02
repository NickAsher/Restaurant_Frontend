function ga_CompleteTransaction(orderId, totalPrice, cartItemsList_FromFrontend){

  let items = [] ;

  cartItemsList_FromFrontend.forEach((cartItem)=>{
    items.push({
      id : cartItem.itemId,
      name : cartItem.itemName,
      category : cartItem.categoryName, //get the categoryName also stored in the localhost storage
      variant : cartItem.itemSizeData.name,
      quantity : 1,
      price : cartItem.itemPrice // or the size price  cartItem.sizeData.price
    }) ;

    // // also inserting the addon items
    // cartItem.addonData.forEach((addonGroup)=>{
    //   let addonGroupName = addonGroup.addonGroupName ;
    //   addonGroup.forEach((addonItem)=>{
    //     items.push({
    //       id : addonItem.id,
    //       name : addonItem.name,
    //       category : addonGroupName,
    //       // variant : 'no variant for addondata'
    //       quantity : 1,
    //       price : addonItem.price
    //     }) ;
    //   }) ;
    // }) ;

  }) ;

  gtag('event', 'purchase', {
    "transaction_id": orderId,
    "affiliation": "Gagneja's Restaurant",
    "value": totalPrice,
    "currency": "INR",
    "tax": 0,
    "shipping": 0,
    "items": items
  });
}

function ga_ViewMenuItem(itemId, itemName, categoryName){
  gtag('event', 'view_item', {
    "items": [
      {
        "id": itemId,
        "name": itemName,
        "category": categoryName,

        // "list_name": "Search Results",
        // "brand": "Google",
        // "variant": "Black", // size isn't selected when we view an item
        // "list_position": 1, // useless
        // "quantity": 2,    // no point in sending quanity info for product detail
        // "price": '2.0'  // since price is not predefined

      }
    ]
  });
}

function ga_AddToCart(cartItem){
  gtag('event', 'add_to_cart', {
    "items": [
      {
        "id": cartItem.itemId,
        "name": cartItem.itemName,
        "category": cartItem.categoryName,
        "variant": cartItem.itemSizeData.name,
        "quantity": 1,
        "price": cartItem.itemPrice
      }
    ]
  });
}

function ga_RemoveFromCart(cartItem){
  gtag('event', 'add_to_cart', {
    "items": [
      {
        "id": cartItem.itemId,
        "name": cartItem.itemName,
        "category": cartItem.categoryName,
        "variant": cartItem.itemSizeData.name,
        "quantity": 1,
        "price": cartItem.itemPrice
      }
    ]
  });
}