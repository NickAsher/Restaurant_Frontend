const express = require('express') ;
const controllerCheckout = require('../controllers/checkout') ;
const {body, validationResult} = require('express-validator') ;
const authenticationMiddleware = require('../middleware/authentication') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;

const showValidationError = validationMiddleware.showValidationError ;
const isAuthenticated = authenticationMiddleware.isAuthenticated ;
const isAuthenticatedPost = authenticationMiddleware.isAuthenticatedPostRequest ;



router.get('/checkout', isAuthenticated('checkout'), controllerCheckout.getCheckoutPage) ;

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