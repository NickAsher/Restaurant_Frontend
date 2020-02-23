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
  $('#cartTable').html("") ;
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

  let totalItemsPrice_BeforeExtraCharges = parseFloat(localStorage.getItem('total_items_price')) ;
  $('#totalItemsPrice_BeforeExtraCharges').addClass('money-currency') ;
  $('#totalItemsPrice_BeforeExtraCharges').html(totalItemsPrice_BeforeExtraCharges) ;

  let taxPercentage = $('#totalTax').attr('data-tax-percentage') ;
  let taxMonetaryValue = totalItemsPrice_BeforeExtraCharges * (parseFloat(taxPercentage)/100) ;
  $('#totalTax').html(taxMonetaryValue) ;
  $('#totalTax').addClass('money-currency') ;

  let totalItemsPrice_AfterExtraCharges = totalItemsPrice_BeforeExtraCharges + taxMonetaryValue ;
  $('#totalItemsPrice_AfterExtraCharges').html(totalItemsPrice_AfterExtraCharges) ;
  $('#totalItemsPrice_AfterExtraCharges').addClass('money-currency') ;


  formatCurrency() ;
} ;


$('#Button_OpenCart').click(function () {
  renderCart() ;

  $(".cartItemDelete").click(function (){
    // this function deleted the cart item from the local storage
    let itemIndex = $(this).attr('data-index') ;
    let cartItems = JSON.parse(localStorage.getItem('cart')) ;
    let removedItem = cartItems.splice(itemIndex, 1) ; // this is an array of 1 removed object
    localStorage.setItem('cart', JSON.stringify(cartItems)) ;
    localStorage.setItem('total_items', parseInt(localStorage.total_items) -1) ;
    localStorage.setItem('total_items_price', ""+parseFloat(localStorage.getItem('total_items_price')) - parseFloat(removedItem[0].itemPrice) ) ;

    $('#totalCartItems').html(localStorage.total_items) ;
    // renderCart() ;
    $('#Button_OpenCart').trigger('click') ; // this is to close the cart dialog
    makeToast('info', "Item removed from cart") ;
  }) ;
}) ;




