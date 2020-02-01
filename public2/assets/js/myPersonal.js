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
