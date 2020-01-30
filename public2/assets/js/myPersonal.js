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

// $("#Button_OpenCart").click(function() {
//
//     console.log("making request on /cart" );
//
//     fetch('/cart').then(function(response) {
//         response.text().then(function(text) {
//             $("#panel-cart").html(text) ;
//             formatCurrency() ;
//
//         });
//     });
// }) ;