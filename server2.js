const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;

const controllerBlogs = require('./controllers/blogs') ;
const controllerGallery = require('./controllers/gallery') ;
const controllerInfo = require('./controllers/info') ;
const controllerHome = require('./controllers/home') ;
const controllerMenu = require('./controllers/menu') ;

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



// app.get('/gallery', controllerGallery.getAllGalleryItems) ;
// app.get('/gallery/:galleryItemId', controllerGallery.getSpecificGalleryItem) ;
//
// app.get('/about', controllerInfo.getAboutUsData) ;
// app.get('/contact', controllerInfo.getContactUsData) ;




app.get('/', (req, res)=>{
  res.render('index-video.hbs') ;
}) ;

app.get('/blogs', controllerBlogs.getAllBlogs) ;
app.get('/blog/:blogId', controllerBlogs.getSingleBlog) ;

app.get('/gallery', controllerGallery.getAllGalleryItems2) ;
// app.get('/gallery/:galleryItemId', controllerGallery.getSpecificGalleryItem) ;

app.listen(3000, ()=>{
    console.log("The server is listening on port 3000") ;
}) ;