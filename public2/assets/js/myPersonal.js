function formatCurrency() {
    const formatter = new Intl.NumberFormat('en-IN',{
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits:3
    }) ;

    $('.money-currency').each(function(index, element){
        $(element).text(formatter.format(element.innerHTML)) ;
        $(element).removeClass("money-currency") ;
    }) ;
}

formatCurrency() ;

function initLocalStorageItems(){
  if(!localStorage.total_items){
    localStorage.setItem('total_items', '0') ;
  }

  if(!localStorage.total_items_price){
    localStorage.setItem('total_items_price', '0') ;
  }

  if(!localStorage.cart){
    localStorage.setItem('cart', '[]') ;
  }
}

initLocalStorageItems() ;


let refreshNoOfItemsInCart = ()=>{
  /* This function refreshes the icon in the top that shows the items in the cart */
  $('#totalCartItems').html(localStorage.getItem('total_items')) ;
} ;

refreshNoOfItemsInCart() ;

