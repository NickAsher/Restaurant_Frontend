let getParsedCartItem = (cartItem)=>{
  try{
    let sizeId = cartItem.itemSizeData.id ;
    let descriptionString = `Size : ${cartItem.itemSizeData.name} <br> ` ;

    cartItem.addonData.forEach((addonGroupData)=>{
      descriptionString += `${addonGroupData.addonGroupName} : ` ;
      addonGroupData.addon_items_array.forEach((addonItem)=>{
        descriptionString += `${addonItem.name}, ` ;
      }) ;
      descriptionString = descriptionString.slice(0, -2);
      descriptionString += " <br> " ;
    }) ;
    descriptionString = descriptionString.slice(0, -5);

    return {
      name : cartItem.itemName,
      itemPrice : cartItem.itemPrice,
      descriptionString
    } ;

  }catch (e) {
    return {
      name : "error",
      descriptionString : e,
    } ;
  }
} ;



let renderCart = ()=>{
  let cartItems = JSON.parse(localStorage.getItem('cart')) ;
  if(cartItems.length == 0){
    $('#cartTable').html("<img src='/img/empty-cart.png' class='img-fluid' >") ;
    $('#div_CartSummary').hide() ;
  }else{
    $('#cartTable').html("") ;
    $('#div_CartSummary').show() ;

  }
  cartItems.forEach(function(element, index){
    let parsedElement = getParsedCartItem(element, index) ;


    $('#cartTable').append(`

            <tr>
                <td class="title">
                    <span class="name"><a href="#productModal" data-toggle="modal">${parsedElement.name}</a></span>
                    <span class="caption text-muted">${parsedElement.descriptionString}</span>
                </td>
                <td class="price"><span class="money-currency">${parsedElement.itemPrice}</span> </td>
                <td class="actions">
                    <i data-index="${index}" class="cartItemDelete ti ti-trash" style="color: darkred; cursor: pointer"></i>
                </td>
            </tr>

          `) ;
  }) ;

  let totalItemsPrice = parseFloat(localStorage.getItem('total_items_price')) ;
  $('#totalItemsPrice').html(totalItemsPrice) ;
  $('#totalItemsPrice').addClass('money-currency') ;


  formatCurrency() ;
} ;


function setupDeleteCartButton(usedBy){

  $(".cartItemDelete").click(function (){
    console.log("called delete on item by ", usedBy) ;
    // this function deletes the single cart item from the local storage
    let itemIndex = $(this).attr('data-index') ;
    let cartItems = JSON.parse(localStorage.getItem('cart')) ;
    let removedItem = cartItems.splice(itemIndex, 1) ; // this is an array of 1 removed object
    ga_RemoveFromCart(removedItem[0]) ;
    localStorage.setItem('cart', JSON.stringify(cartItems)) ;
    localStorage.setItem('total_items', parseInt(localStorage.total_items) -1) ;
    localStorage.setItem('total_items_price', ""+parseFloat(localStorage.getItem('total_items_price')) - parseFloat(removedItem[0].itemPrice) ) ;

    switch (usedBy){
      case "cart_normal" :
        $('#totalCartItems').html(localStorage.total_items) ;
        $('#Button_OpenCart').trigger('click') ;
        break;
      case "cart_mobile" :
        $('#totalCartItems_Mobile').html(localStorage.total_items) ;
        $('#Button_OpenCart_Mobile').trigger('click') ;
        break ;
      case "checkout" :
        renderCart() ;
        //need to set the delete listener again because,
        // once the cart is rendered again, we delete the whole cartTable and render it again
        // This means that the click listener is gone, so we need to set it again
        setupDeleteCartButton("checkout") ;
    }

    makeToast('info', "Item removed from cart") ;
  }) ;
}

$('#Button_OpenCart').click(function () {
  renderCart() ;
  // the reason this cartItemDelete is inside the #Button_OpenCart onClick is because
  // the cart is not rendered when we put the following code outside
  // meaning there is no cart, no delete buttons, so the code won't work,
  // also every time the cart is rendered again, the click listener for delete is gone.
  setupDeleteCartButton("cart_normal") ;
}) ;

$('#Button_OpenCart_Mobile').click(function () {
  renderCart() ;
  setupDeleteCartButton("cart_mobile") ;
}) ;

$('#Button_LinkGoToCheckout').click(function () {
  if(localStorage.getItem('total_items_price') == '0'){
    makeToast('error', 'Empty Cart') ;
  }else{
    window.location.href = '/checkout' ;
  }
}) ;







function parseCartForBackend(){
  /* This function takes the cart from the local-storage, and parses it for sending it to the backend order
   *
   * Terminology used : frontendCart : the cart taken from localStorage
   *  backendCart : the cart to send back
   */

  let frontendCart = JSON.parse(localStorage.getItem('cart')) ;
  let backendCart = [] ;

  frontendCart.forEach((element, index)=>{
    // just need to parse the item_addonData
    let parsedItemAddonData = [] ;

    element.addonData.forEach((addonGroupElement, index2)=>{

      let addonItemsArray = addonGroupElement.addon_items_array.map((addonItem)=>{
        return addonItem.id ;
      }) ;

      parsedItemAddonData.push({
        addon_group_id : addonGroupElement.addonGroupId,
        addon_items_array : addonItemsArray
      }) ;
    }) ;

    backendCart.push({
      item_id : element.itemId,
      item_size_id : element.itemSizeData.id,
      item_quantity : 1,
      item_addon : parsedItemAddonData
    }) ;
  }) ;
  return backendCart ;




}




