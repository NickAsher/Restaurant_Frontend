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
const parseUtils = require('./utils/parse') ;
const app = express() ;
app.set('view engine', 'hbs') ;
// app.set('views', path.join(__dirname, "./views")) ;
app.set('views', path.join(__dirname, "./public2/views")) ;


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



app.use((req, res, next)=>{
  // check if client has the cookie
  if (req.cookies.cart === undefined) {
    res.cookie('logged_in', true, {httpOnly : true, maxAge : 60*60*24*7 }) ;
    res.cookie('cart', '[]', {httpOnly : true, maxAge : 60*60*24*7 }) ;
    res.cookie('total_items', 0, {httpOnly : true, maxAge : 60*60*24*7 }) ;
    res.cookie('total_price', 0, {httpOnly : true, maxAge : 60*60*24*7 }) ;
    console.log("cookies have been set") ;
  }
  next();
});


app.get('/', controllerHome.getHomePage) ;

app.get('/clear', (req, res)=>{
  res.cookie('logged_in', true, {httpOnly : true, maxAge : 60*60*24*7 }) ;
  res.cookie('cart', '[]', {httpOnly : true, maxAge : 60*60*24*7 }) ;
  res.cookie('total_items', 0, {httpOnly : true, maxAge : 60*60*24*7 }) ;
  res.cookie('total_price', 0, {httpOnly : true, maxAge : 60*60*24*7 }) ;

  res.send(`
    <script>
        localStorage.removeItem('cart') ;
        localStorage.removeItem('total_items') ;
        localStorage.removeItem('total_items_price') ;
        
        window.location.href= '/menu' ;
    </script>
  `);
}) ;



app.get('/menu', controllerMenu.getMenu) ;
app.all('/item/:categoryId/:itemId', controllerMenu.getItem_ModalProduct) ;

app.get('/checkout', async (req, res)=>{

  res.render('checkout.hbs', {
    IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
    IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
  }) ;
}) ;

app.get('/blogs', controllerBlogs.getAllBlogs_Paginated) ;
app.get('/blog/:blogId', controllerBlogs.getSingleBlog) ;

app.get('/gallery', controllerGallery.getAllGalleryItems) ;

app.get('/contact', controllerInfo.getContactUsData) ;
app.get('/about', controllerInfo.getAboutUsData) ;
app.get('/specials', controllerInfo.getOfferSpecialsData) ;


app.all('/itemy/:categoryId/:itemId', controllerMenu.getItemDetail_DataOnly) ;

app.listen(3000, ()=>{
    console.log("The server is listening on port 3000") ;
}) ;