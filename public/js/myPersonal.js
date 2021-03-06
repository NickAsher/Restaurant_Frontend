function checkLocalStorage(){
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('feature_test', 'yes');
      if (localStorage.getItem('feature_test') === 'yes') {
        localStorage.removeItem('feature_test');
        // localStorage is enabled
      } else {
        alert("Local storage is disabled, please use a modern browser") ;
        // localStorage is disabled
      }
    } catch(e) {
      alert("Local storage is disabled, please use a modern browser") ;
      // localStorage is disabled
    }
  } else {
    alert("Local storage is disabled, please use a modern browser") ;
    // localStorage is not available
  }
}
checkLocalStorage() ;

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

  if(!localStorage.today){
    localStorage.setItem('today', new Date().toLocaleDateString()) ;
  }

}

initLocalStorageItems() ;

function resetLocalStorage(){
  localStorage.setItem('total_items', '0') ;
  localStorage.setItem('total_items_price', '0') ;
  localStorage.setItem('cart', '[]') ;
  localStorage.setItem('today', new Date().toLocaleDateString()) ;

}

if(localStorage.getItem('today') != new Date().toLocaleDateString()){
  resetLocalStorage() ;
}


$('#btn-SignOut, #btn-SignOut-mobile').click(()=>{
  console.log("clicked signOut button") ;
  fetch('/signout', {
    method : 'POST',
    body : new URLSearchParams({
      _csrf : $('#btn-SignOut').attr('data-csrf'),
    })
  })
  .then((response)=>response.json()) // have to do this for some goddamn reason otherwise the return data is just http status codes
  .then((data)=>{
    if(data.status == true){
      window.location.href = '/' ;
    }else{
      console.log(data) ;
      throw "error in signing out" ;
    }
  })
  .catch((err)=>{
    console.log(err) ;
    makeToast('error', "error in signing out") ;
  }) ;
}) ;

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




let refreshNoOfItemsInCart = ()=>{
  /* This function refreshes the icon in the top that shows the items in the cart */
  $('#totalCartItems, #totalCartItems_Mobile').html(localStorage.getItem('total_items')) ;
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

function makeErrorToast(msg){
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "500",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  } ;
}

refreshNoOfItemsInCart() ;

function redirectBack(defaultRedirection){
  // check if there is query paramter called redirect like      https://www.rest.com?redirect=checkout
  // if there is , then go there, else go to argument given function parameter

  let searchParams = new URLSearchParams(window.location.search) ;
  if(searchParams.has('redirect')){
    window.location.href = "/" + searchParams.get('redirect') ;
  }else{
    window.location.href = defaultRedirection ;
  }
}

function showError(errorInfo, myMmg){
  makeToast('error', myMmg) ;
  console.log(myMmg);
  console.log(errorInfo);
}

function showSpinner(element){
  element.children('span').hide() ;
  element.children('div').remove() ;
  element.prepend(`
      <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
      </div>
  `) ;
}


function hideSpinner(element){
  element.children('span').show() ;
  element.children('div').hide() ;
}



