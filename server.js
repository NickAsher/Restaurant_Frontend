const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const rp = require('request-promise') ;

const controllerBlogs = require('./controllers/blogs') ;
const controllerGallery = require('./controllers/gallery') ;
const controllerInfo = require('./controllers/info') ;
const controllerHome = require('./controllers/home') ;
const controllerMenu = require('./controllers/menu') ;

const app = express() ;
app.set('view engine', 'hbs') ;
app.set('views', path.join(__dirname, "./views")) ;
hbs.registerPartials(path.join(__dirname, "./views/includes/")) ;
app.use(express.static("public"));

app.get('/', controllerHome.getHomePage) ;
app.post('/', controllerHome.postHomePage) ;

app.get('/menu', controllerMenu.getMenu) ;
app.get('/item/:categoryId/:itemId', controllerMenu.getMenuDetail) ;
app.get('/item2/:categoryId/:itemId', controllerMenu.getMenuDetail2) ;

app.get('/blogs', controllerBlogs.getAllBlogs) ;
app.get('/blogs/:blogId', controllerBlogs.getSpecificBlog) ;

app.get('/gallery', controllerGallery.getAllGalleryItems) ;
app.get('/gallery/:galleryItemId', controllerGallery.getSpecificGalleryItem) ;

app.get('/about', controllerInfo.getAboutUsData) ;
app.get('/contact', controllerInfo.getContactUsData) ;

app.listen(3000, ()=>{
    console.log("The server is listening on port 3000") ;
}) ;