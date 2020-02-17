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


function makeToast(toastStyle, toastMessage) {
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  } ;

  toastr[toastStyle](toastMessage) ;
}

refreshNoOfItemsInCart() ;




