const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;
const fs = require('fs') ;
const bcrypt = require('bcrypt') ;
const session = require('express-session') ;
const csrf = require('csurf') ;

const controllerBlogs = require('./controllers/blogs') ;
const controllerGallery = require('./controllers/gallery') ;
const controllerInfo = require('./controllers/info') ;
const controllerHome = require('./controllers/home') ;
const controllerMenu = require('./controllers/menu') ;
const controllerAuth = require('./controllers/auth') ;
const dbRepository = require('./utils/DbRepository') ;
const parseUtils = require('./utils/parse') ;


const app = express() ;
app.set('view engine', 'hbs') ;
app.set('views', path.join(__dirname, "./public2/views")) ;

hbs.registerPartials(path.join(__dirname, "./public2/views/includes/")) ;
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.use(express.static("public2"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser()) ;
app.use(session({
  secret : "this is my secret", //key use to sign session data(only sign, not encrypt)
  resave : false, // don't resave session if it isn't changed
  saveUninitialized : false, //don't save an empty session
  name : 'my_session_id', //name for the cookie that stores session id
  cookie : {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite :true,
    secure :false // use it when using https
  }
})) ;
// using the default values for the csrf token.
// can use options like csrf({ option1:val1, option2:val2 })
app.use(csrf()) ;

app.use((req, res, next)=>{
  console.log(`[${req.method} ${req.originalUrl} ], [user  : ${req.session.userId} ]`) ;
  next() ;
}) ;

app.use((req, res, next)=>{
  res.locals.IMAGE_FRONTEND_LINK_PATH = Constants.IMAGE_FRONTEND_LINK_PATH ;
  res.locals.IMAGE_BACKENDFRONT_LINK_PATH = Constants.IMAGE_BACKENDFRONT_LINK_PATH ;
  res.locals.VIDEO_FRONTEND_LINK_PATH = Constants.VIDEO_FRONTEND_LINK_PATH ;
  res.locals.signedIn = req.session.isLoggedIn ;
  res.locals._csrfToken = req.csrfToken() ; // this method will create a new csrf token and set that token in user session
  next() ;
}) ;





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

const authRedirectHome = (req, res, next)=>{
  if(req.session.isLoggedIn == true){
    res.redirect('/') ;
    //TODO show message that you are already logged in
  }else{
    next() ;
  }
} ;
const isAuthenticated = (redirectBack)=>{
  /* Middleware to authenticate user on pages which need authentication
   * @param {string} redirectBack - The page where we should come back to after authentication
   *
   *  this function checks if the user is authenticated using session.isLoggedIn
   *    If they are, they simply go to their page
   *    If not, they are redirected to login page and query ?redirect=backPage is set
   *
   */
  return (req, res, next)=>{
    if(req.session.isLoggedIn != true){
      res.redirect(`/login?redirect=${redirectBack}`);
      //TODO show message that you need to be logged in
    }else{
      next();
    }
  } ;
} ;





app.get('/', controllerHome.getHomePage) ;

app.get('/menu', controllerMenu.getMenu) ;
app.get('/item/:categoryId/:itemId', controllerMenu.getItem_ModalProduct) ;
app.get('/itemy/:categoryId/:itemId', controllerMenu.getItemDetail_DataOnly) ;

app.get('/checkout', isAuthenticated('checkout'), async (req, res)=>{
  res.render('checkout.hbs', {
  }) ;
}) ;

app.get('/blogs', controllerBlogs.getAllBlogs_Paginated) ;
app.get('/blog/:blogId', controllerBlogs.getSingleBlog) ;
app.get('/gallery', controllerGallery.getAllGalleryItems) ;
app.get('/contact', controllerInfo.getContactUsData) ;
app.get('/about', controllerInfo.getAboutUsData) ;
app.get('/specials', controllerInfo.getOfferSpecialsData) ;

app.get('/login', authRedirectHome, controllerAuth.getLoginPage) ;
app.post('/login', authRedirectHome,  controllerAuth.postLoginPage) ;
app.get('/signup', authRedirectHome, controllerAuth.getSignUpPage) ;
app.post('/signup', controllerAuth.postSignUpPage) ;
app.get('/signout', controllerAuth.signOut) ;
app.post('/signup/google', controllerAuth.postSignUp_Google) ;
app.post('/signup/facebook', controllerAuth.postSignUp_Facebook) ;
app.get('/resetPassword', authRedirectHome, controllerAuth.getResetPasswordPage) ;
app.post('/resetPassword', controllerAuth.postResetPassword) ;
app.get('/resetPassword/:resetToken', controllerAuth.getResetPasswordTokenPage) ;
app.post('/saveResetPassword/', controllerAuth.postResetPasswordToken) ;




app.listen(3000, ()=>{
    console.log("The server is listening on port 3000") ;
}) ;