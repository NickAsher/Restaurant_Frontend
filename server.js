const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/database') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;
const session = require('express-session') ;
const csrf = require('csurf') ;
const logger = require('./middleware/logging') ;
const redis = require('redis') ;
let redisStore = require('connect-redis')(session) ;

require('dotenv').config() ;



const app = express() ;
app.set('view engine', 'hbs') ;
app.set('views', path.join(__dirname, "./views")) ;

hbs.registerPartials(path.join(__dirname, "./views/includes/")) ;
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('toJSON', function(obj) {
  return JSON.stringify(obj, null, 4);
});

app.use(express.static("public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser()) ;

let redisClient = redis.createClient({
  host : '127.0.0.1',
  port : 6379
}) ;

app.use(session({
  secret : "this is my secret", //key use to sign session data(only sign, not encrypt)
  resave : false, // don't resave session if it isn't changed
  saveUninitialized : false, //don't save an empty session
  name : 'my_session_id', //name for the cookie that stores session id
  cookie : {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite :'lax', //very important, otherwise third party redirect will create new sessions
    secure :false // use it when using https
  },
  store: new redisStore({
    client: redisClient,
    prefix:'fsess:',
    ttl : 86400, // one day, this is also the default value of ttl
    disableTouch : true // disables resetting the ttl value when a session is accessed again. Meaning the key will expire after 1 day
  }),
})) ;


app.use((req, res, next)=>{
  logger.info(`{'method' : '${req.method}','url':'${req.originalUrl}'}`) ;
  next() ;
}) ;

redisClient.on('error', (err)=>{
  logger.error(` 'redisError' : '${err}`) ;
}) ;

app.use((req, res, next)=>{
  if (!req.session) {
    logger.error(` 'redisError' : 'Looks like req.session is not defined`) ;
    return res.status(422).render('error.hbs', {
      status:false,
      error : "Looks like something is wrong with redis session server. req.session is undefined"
    });
  }
  next() ; // otherwise continue
}) ;


app.use((req, res, next)=>{
  res.locals.IMAGE_FRONTEND_LINK_PATH = Constants.IMAGE_FRONTEND_LINK_PATH ;
  res.locals.IMAGE_BACKENDFRONT_LINK_PATH = Constants.IMAGE_BACKENDFRONT_LINK_PATH ;
  res.locals.VIDEO_FRONTEND_LINK_PATH = Constants.VIDEO_FRONTEND_LINK_PATH ;
  res.locals.signedIn = req.session.isLoggedIn ;
  res.locals.isEnvironmentProduction = process.env.NODE_ENV == 'production' ? true : false ;
  res.locals.publicDirectoryLocation = Constants.PUBLIC_DIRECTORY_LOCATION ;
  next() ;
}) ;

// since checkout has the stripe page, we are unable to use csrf authentication
// so it is added before the csrf middleware
app.use(require('./routes/router_checkout')) ;


// using the default values for the csrf token.
// can use config like csrf({ option1:val1, option2:val2 })
app.use(csrf()) ;
app.use((req, res, next)=>{
  res.locals._csrfToken = req.csrfToken() ; // this method will create a new csrf token
  next() ;
}) ;


app.use(require('./routes/router_info')) ;
app.use(require('./routes/router_blogs')) ;
app.use(require('./routes/router_menu')) ;
app.use(require('./routes/router_auth')) ;

app.get('/privacy_policy', (req, res)=>{
  res.render('privacy_policy.hbs') ;
}) ;
app.get('/error', (req, res)=>{
  res.render('error.hbs', {
    showBackLink : true,
    backLink : "/",
    error : {
      status : false,
      e_message : "This is some message",
      e_toString : "This error : This is some message",
    }
  }) ;
}) ;

app.get('/emailUnverified', (req, res)=>{
  res.render('emailUnverified.hbs') ;
}) ;

app.get('*', (req, res)=>{
  res.render('404.hbs') ;
});


app.listen(3000, ()=>{
    console.log("The server is listening on port 3000") ;
}) ;