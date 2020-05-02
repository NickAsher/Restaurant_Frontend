const express = require('express') ;
const {body, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;
const authenticationMiddleware = require('../middleware/authentication') ;
const controllerAuth = require('../controllers/auth') ;

const router = express.Router() ;



const showValidationError = validationMiddleware.showValidationError ;
const customValidation_Password = validationMiddleware.customValidation_Password ;
const authRedirectHome = authenticationMiddleware.authRedirectHome ;



router.get('/login', authRedirectHome, controllerAuth.getLoginPage) ;


router.post('/login', [
  body('post_Email', 'Invalid Email').notEmpty().isEmail().normalizeEmail(),
  body('post_Password', "Invalid Password").notEmpty().trim().isLength({min:8}).custom(customValidation_Password),
], showValidationError, controllerAuth.postLoginPage) ;


router.post('/signup', [
  body('post_Firstname', "Invalid Firstname").exists().not().isEmpty().trim().escape(),
  body('post_Lastname', "Invalid Lastname").exists().not().isEmpty().trim().escape(),
  body('post_Email').not().isEmpty().isEmail()
  .withMessage("Valid email not provied").normalizeEmail(),
  body('post_Password', "Invalid Password").notEmpty().trim().isLength({min:8}).custom(customValidation_Password),
  body('post_PasswordAgain', "Passwords do not match").notEmpty().trim().custom((value, {req})=>{
        return value == req.body.post_Password ;
  }),
], showValidationError, controllerAuth.postSignUpPage) ;


router.post('/signout', controllerAuth.signOut) ;


router.post('/signup/google', [
  body('post_idToken', "idToken does not exist").exists().not().isEmpty()
], showValidationError, controllerAuth.postSignUp_Google) ;


router.post('/signup/facebook', controllerAuth.postSignUp_Facebook) ;


router.post('/forgotPassword', [
      body('post_Email', 'Invalid Email').notEmpty().trim().isEmail().normalizeEmail(),
], showValidationError, controllerAuth.postForgotPassword) ;


router.get('/resetPassword/:resetToken', controllerAuth.getResetPasswordTokenPage) ;

router.post('/resetPassword', [
  body('post_resetToken', "ressetToken does noot exist").exists().not().isEmpty(),
  body('post_newPassword', "Invalid Password").notEmpty().trim().isLength({min:8}).custom(customValidation_Password),
  body('post_newPasswordAgain', "Passwords do not match").notEmpty().trim().custom((value, {req})=>{
    return value == req.body.post_newPassword ;
  }),
], showValidationError, controllerAuth.postResetPasswordToken) ;




module.exports = router ;