exports.getCart_Parsed = (stringCartData)=>{
  try{
    let cartData = JSON.parse(stringCartData|| '[]') ;
    let totalPrice = 0 ;
    let newCartData = [] ;

    cartData.forEach((cartItem)=>{
      let basePrice = parseFloat(cartItem.itemSizeData.price) ;
      let sizeId = cartItem.itemSizeData.id ;
      let descriptionString = `Size : ${cartItem.itemSizeData.name} <br> ` ;

      cartItem.addonData.forEach((addonGroupData)=>{
        descriptionString += `${addonGroupData.addongroupName} : ` ;
        addonGroupData.addon_items_array.forEach((addonItem)=>{
          descriptionString += `${addonItem.name}, ` ;
          addonItem.price.forEach((addonItemSizePriceData)=>{
            if(addonItemSizePriceData.sizeId == sizeId){
              basePrice += parseFloat(addonItemSizePriceData.price) ;
            }
          }) ;
        }) ;
        descriptionString = descriptionString.slice(0, -2);
        descriptionString += " <br> " ;
      }) ;
      descriptionString = descriptionString.slice(0, -5);
      totalPrice += basePrice ;
      newCartData.push({
        name : cartItem.itemName,
        basePrice,
        descriptionString
      }) ;
    });

    return {
      status : true,
      cartData: newCartData,
      totalPrice
    } ;



  }catch (e) {
    return{
      status : false,
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    };
  }
} ;







