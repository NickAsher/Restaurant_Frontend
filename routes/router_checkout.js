const express = require('express') ;
const controllerCheckout = require('../controllers/checkout') ;
const {body, validationResult} = require('express-validator') ;

const router = express.Router() ;



const isAuthenticatedPost =  ()=>{
  /* Middleware to check if post request comes from authenticated user
   *
   *  this function checks if the user is authenticated using session.isLoggedIn
   *    If they are, the post requests does what it's supposed to do
   *    If not, it sends a status:false with error message
   */
  return (req, res, next)=>{
    if(req.session.isLoggedIn != true){   // checks for both false and undefined this way
      res.send({
        status : false,
        e : "User is not authenticated"
      }) ;
    }else{
      next();
    }
  } ;
} ;

const showValidationError = (req, res, next)=>{
  const errors = validationResult(req) ;

  if (!errors.isEmpty()) {
    return res.status(422).send({
      status:false,
      error : errors.array()
    });
  } else {
    next() ;
  }
} ;



router.post('/checkout', isAuthenticatedPost(), [

  body('backendCart', "Invalid Cart").custom((item, {req})=>{
    return Array.isArray(item) && item.length > 0 ;
  }),
  body('firstname', "Invalid Firstname").exists().not().isEmpty().trim().escape(),
  body('lastname', "Invalid Lastname").exists().not().isEmpty().trim().escape(),
  body('email', 'Invalid Email').not().isEmpty().isEmail().normalizeEmail(),
  body('phone', 'Invalid phone').not().isEmpty().isNumeric().isLength({min:6, max:12}),
  body('addressLine1', "Invalid Address Line 1").exists().not().isEmpty().trim().escape(),
  body('addressLine2', "Invalid Address Line 2").exists().not().isEmpty().trim().escape(),
  body('addressLine3', "Invalid Address Line 3").exists().not().isEmpty().trim().escape(),

], showValidationError,  controllerCheckout.postCheckoutPage) ;


router.post('/checkout-development', isAuthenticatedPost(), [

  body('backendCart', "Invalid Cart").custom((item, {req})=>{
    return Array.isArray(item) && item.length > 0 ;
  }),
  body('firstname', "Invalid Firstname").exists().not().isEmpty().trim().escape(),
  body('lastname', "Invalid Lastname").exists().not().isEmpty().trim().escape(),
  body('email', 'Invalid Email').not().isEmpty().isEmail().normalizeEmail(),
  body('phone', 'Invalid phone').not().isEmpty().isNumeric().isLength({min:6, max:12}),
  body('addressLine1', "Invalid Address Line 1").exists().not().isEmpty().trim().escape(),
  body('addressLine2', "Invalid Address Line 2").exists().not().isEmpty().trim().escape(),
  body('addressLine3', "Invalid Address Line 3").exists().not().isEmpty().trim().escape(),

], showValidationError,  controllerCheckout.postDevelopmentCheckoutPage) ;


module.exports = router ;