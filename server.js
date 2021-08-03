const express = require('express') ;
const path = require('path') ;
const hbs = require('hbs') ;
const dbConnection = require('./utils/DatabaseConnection') ;
const Constants = require('./utils/Constants') ;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser") ;
const session = require('express-session') ;
const csrf = require('csurf') ;
const logger = require('./middleware/MiddlewareLogging') ;
const redis = require('redis') ;
let redisStore = require('connect-redis')(session) ;
const Mailgen = require('mailgen') ;

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
  // host : process.env.NODE_ENV == 'production' ? process.env.REDIS_HOST_PRODUCTION : process.env.REDIS_HOST_LOCAL,
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
  res.locals.IMAGE_BACKENDFRONT_LINK_PATH = Constants.IMAGE_BACKENDFRONT_LINK_PATH ;
  res.locals.signedIn = req.session.isLoggedIn ;
  res.locals.isEnvironmentProduction = process.env.NODE_ENV == 'production' ? true : false ;
  res.locals.publicDirectoryLocation = Constants.PUBLIC_DIRECTORY_LOCATION ;
  next() ;
}) ;

// since checkout has the stripe page, we are unable to use csrf authentication
// so it is added before the csrf middleware
app.use(require('./routes/RouterCheckout')) ;


// using the default values for the csrf token.
// can use config like csrf({ option1:val1, option2:val2 })
app.use(csrf()) ;
app.use((req, res, next)=>{
  res.locals._csrfToken = req.csrfToken() ; // this method will create a new csrf token
  next() ;
}) ;


app.use(require('./routes/RouterInfo')) ;
app.use(require('./routes/RouterBlogs')) ;
app.use(require('./routes/RouterMenu')) ;
app.use(require('./routes/RouterAuthentication')) ;

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

app.get('/invoice', (req, res)=>{

  let mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
      // Appears in header & footer of e-mails
      name: 'Rafique.in',
      link: 'https://www.gagneja.rafique.in',
      // Optional product logo
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/157px-Google_%22G%22_Logo.svg.png'
    }
  }) ;

  let userName = "John Malkovich" ;
  let orderId = "e4rjkfdfkg" ;



  let email = {
    body: {
      name: userName,
      intro: `Thank you for placing your order at Gagneja's. Your Order id is  "${orderId}"`,
      table: {
        data: [
          {
            item: 'Margherita',
            description: '(Medium)<br> Crusts : Normal Crust <br> Cheeses : Blue Cheese ',
            price: '$10.99'
          },
          {
            item: 'Double Cheese',
            description: '(Medium)<br> Crusts : Normal Crust <br> Cheeses : Blue Cheese ',
            price: '$1.99'
          },
          {
            item : '<b>TOTAL</b>',
            description : '',
            price : '<b>200</b>'
          }
        ],
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            item: '20%',
            price: '15%'
          },
          // Optionally, change column text alignment
          customAlignment: {
            price: 'right'
          }
        }
      },



      outro: 'Thank you for ordering with us. Your order will be delivered shortly'
    }
  };

// Generate an HTML email with the provided contents
  let emailBody = mailGenerator.generate(email);

  res.send(emailBody) ;


});


app.get('*', (req, res)=>{
  res.render('404.hbs') ;
});


app.listen(3000, ()=>{
    console.log("The server is listening on port 3000") ;
}) ;