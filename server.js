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
const crypto = require('crypto') ;

const controllerBlogs = require('./controllers/blogs') ;
const controllerInfo = require('./controllers/info') ;
const controllerMenu = require('./controllers/menu') ;
const controllerAuth = require('./controllers/auth') ;
const controllerCheckout = require('./controllers/checkout') ;

const dbRepository = require('./utils/DbRepository') ;
const parseUtils = require('./utils/parse') ;


const app = express() ;
app.set('view engine', 'hbs') ;
app.set('views', path.join(__dirname, "./views")) ;

hbs.registerPartials(path.join(__dirname, "./views/includes/")) ;
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.use(express.static("public"));
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

app.use((req, res, next)=>{
  console.log(`[${req.method} ${req.originalUrl} ], [user  : ${req.session.userId} ]`) ;
  next() ;
}) ;

//TODO check if you can send csurf token with pay requests of stripe
// this is above the csrf middleware




// using the default values for the csrf token.
// can use options like csrf({ option1:val1, option2:val2 })
app.use(csrf()) ;




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






app.use(require('./routes/checkout')) ;


app.use(require('./routes/info')) ;
app.use(require('./routes/blogs')) ;
app.use(require('./routes/menu')) ;
app.use(require('./routes/auth')) ;



app.get('*', (req, res)=>{
  res.render('404.hbs') ;
});

app.listen(3000, ()=>{
    console.log("The server is listening on port 3000") ;
}) ;