const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;
const fs = require('fs') ;

const controllerBlogs = require('./controllers/blogs') ;
const controllerGallery = require('./controllers/gallery') ;
const controllerInfo = require('./controllers/info') ;
const controllerHome = require('./controllers/home') ;
const controllerMenu = require('./controllers/menu') ;
const dbRepository = require('./utils/DbRepository') ;

const app = express() ;
app.set('view engine', 'hbs') ;
// app.set('views', path.join(__dirname, "./views")) ;
app.set('views', path.join(__dirname, "./public2")) ;


// hbs.registerPartials(path.join(__dirname, "./views/includes/")) ;
hbs.registerPartials(path.join(__dirname, "./public2/views/includes/")) ;
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// app.use(express.static("public"));
app.use(express.static("public2"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser()) ;



// app.get('/', controllerHome.getHomePage) ;
// app.post('/', controllerHome.postHomePage) ;
//
// app.get('/menu', controllerMenu.getMenu) ;
// app.get('/item/:categoryId/:itemId', controllerMenu.getMenuDetail) ;
// app.post('/menu', controllerMenu.postMenu) ;
// app.all('/cart', controllerMenu.getCart) ;


// app.get('/about', controllerInfo.getAboutUsData) ;
// app.get('/contact', controllerInfo.getContactUsData) ;




app.get('/', (req, res)=>{
  res.render('index-video.hbs', {
    TOTAL_CART_ITEMS : req.cookies.total_items,
  }) ;
}) ;

app.get('/clear', (req, res)=>{
  res.cookie('logged_in', true, {httpOnly : true, maxAge : 60*60*24*7 }) ;
  res.cookie('cart', '[]', {httpOnly : true, maxAge : 60*60*24*7 }) ;
  res.cookie('total_items', 0, {httpOnly : true, maxAge : 60*60*24*7 }) ;
  res.cookie('total_price', 0, {httpOnly : true, maxAge : 60*60*24*7 }) ;

  res.redirect('/menu') ;
}) ;

app.get('/menu', controllerMenu.getMenu) ;
app.post('/menu', controllerMenu.postMenu) ;
app.all('/item/:categoryId/:itemId', controllerMenu.getItem_ModalProduct) ;


app.get('/cart', (req, res)=>{
  try{
    let cartData = JSON.parse(req.cookies.cart) ;
    let totalPrice = 0 ;
    let newCartData = [] ;

    cartData.forEach((cartItem)=>{
      let basePrice = parseFloat(cartItem.itemSizeData.price) ;
      let sizeId = cartItem.itemSizeData.id ;
      let DescriptionString = `Size : ${cartItem.itemSizeData.name} \n ` ;

      cartItem.addonData.forEach((addonGroupData)=>{
        DescriptionString += `${addonGroupData.addongroupName} : ` ;
        addonGroupData.addon_items_array.forEach((addonItem)=>{
          DescriptionString += `${addonItem.name}, ` ;
          addonItem.price.forEach((addonItemSizePriceData)=>{
            if(addonItemSizePriceData.sizeId == sizeId){
              basePrice += parseFloat(addonItemSizePriceData.price) ;
            }
          }) ;
        }) ;
        DescriptionString = DescriptionString.slice(0, -2);
        DescriptionString += " \n " ;
      }) ;
      DescriptionString = DescriptionString.slice(0, -3);
      totalPrice += basePrice ;
      newCartData.push({
        name : cartItem.itemName,
        basePrice,
        DescriptionString
      }) ;
    });

    // res.send({
    //   newCartData,
    //   cartData,
    // }) ;

    res.render('views/includes/cart_new.hbs', {
      IMAGE_FRONTEND_LINK_PATH: Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH: Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS: req.cookies.total_items,
      cartData: newCartData,
      totalPrice
    }) ;

  }catch (e) {
    res.send({
      e : e.message,
      msg : "Beta ji koi to error hai"
    }) ;
  }
}) ;

app.all('/item2/:categoryId/:itemId', controllerMenu.getMenuDetail_DataOnly) ;

app.get('/carty', controllerMenu.getCart) ;

app.get('/blogs', controllerBlogs.getAllBlogs) ;
app.get('/blog/:blogId', controllerBlogs.getSingleBlog) ;

app.get('/gallery', controllerGallery.getAllGalleryItems) ;
app.get('/contact', controllerInfo.getContactUsData2) ;


app.get('/about', async (req, res)=>{
  let aboutData = await dbRepository.getAboutData() ;

  res.render('about.hbs', {
    IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
    IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    TOTAL_CART_ITEMS : req.cookies.total_items,
    aboutData : aboutData['data']
  }) ;
}) ;

app.get('/specials', async (req, res)=>{
  let offersData = await dbRepository.getOfferSpecialData() ;

  res.render('offers.hbs', {
    IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
    IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
    TOTAL_CART_ITEMS : req.cookies.total_items,
    offersData : offersData['data']
  }) ;
}) ;

app.listen(3000, ()=>{
    console.log("The server is listening on port 3000") ;
}) ;