/*
 * This adds the clickable functionality to the a table data cell <td> .
 * To use this , simply add class of 'td-link' to a <td> tag
 * And specify the url in the data-href attribute
 * Example =>
 *      <td class='td-link' data-href='www.google.com' >Table Data here</td>
 *
 *
 */
$(".td-link").click(function() {
    window.location = $(this).data("href");
});
$(".addon-link").click(function() {
    window.location = $(this).data("href");
});
$(".tr-link").click(function() {
    window.location = $(this).data("href");
});