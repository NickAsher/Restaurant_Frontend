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

$('#Button_OpenCart').click(function () {
  let cartItems = JSON.parse(localStorage.getItem('cart')) ;
  $('#cartTable').html("") ;
  cartItems.forEach(function(element, index){
    let parsedElement = getParsedCartItem(element) ;


    $('#cartTable').append(`

            <tr>
                <td class="title">
                    <span class="name"><a href="#productModal" data-toggle="modal">${parsedElement.name}</a></span>
                    <span class="caption text-muted">${parsedElement.descriptionString}</span>
                </td>
                <td class="price"><span class="money-currency">${parsedElement.itemPrice}</span> </td>
                <td class="actions">
                    <a href="#productModal" data-toggle="modal" class="action-icon"><i class="ti ti-pencil"></i></a>
                    <a href="#" class="action-icon"><i class="ti ti-close"></i></a>
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
}) ;