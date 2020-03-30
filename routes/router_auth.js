const express = require('express') ;
const {body, validationResult} = require('express-validator') ;

const controllerAuth = require('../controllers/auth') ;

const router = express.Router() ;


const authRedirectHome = (req, res, next)=>{
  if(req.session.isLoggedIn == true){
    res.redirect('/') ;
    //TODO show message that you are already logged in
  }else{
    next() ;
  }
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



router.get('/login', authRedirectHome, controllerAuth.getLoginPage) ;
router.post('/login',
    [
      body('post_Email').not().isEmpty().isEmail()
      .withMessage("Valid email not provied").normalizeEmail(),
      body('post_Password', "Password must be 8 characyers long and must contain atleast number and 1 special character")
      .isLength({min:4}),
    ],
    showValidationError,
    controllerAuth.postLoginPage) ;


router.post('/signup',
    [
      body('post_Firstname', "Invalid Firstname").exists().not().isEmpty().trim().escape(),
      body('post_Lastname', "Invalid Lastname").exists().not().isEmpty().trim().escape(),
      body('post_Email').not().isEmpty().isEmail()
      .withMessage("Valid email not provied").normalizeEmail(),
      body('post_Password', "Password must be 8 characters long and must contain atleast number and 1 special character")
      .isLength({min:4}),
      body('post_PasswordAgain', "Passwords do not match")
          .isLength({min:4})
        .custom((value, {req})=>{
            return value == req.body.post_Password ;
      }),

    ],
    showValidationError, controllerAuth.postSignUpPage) ;

router.post('/signout', controllerAuth.signOut) ;
router.post('/signup/google',
    [
      body('post_idToken', "idToken does not exist").exists().not().isEmpty()
    ], showValidationError,
    controllerAuth.postSignUp_Google) ;

router.post('/signup/facebook', controllerAuth.postSignUp_Facebook) ;

router.post('/forgotPassword',
    [
      body('post_Email').not().isEmpty().isEmail()
      .withMessage("Valid email not provied").normalizeEmail(),
    ],
    showValidationError, controllerAuth.postForgotPassword) ;

router.get('/resetPassword/:resetToken', controllerAuth.getResetPasswordTokenPage) ;
router.post('/resetPassword',
    [
      body('post_resetToken', "ressetToken does noot exist").exists().not().isEmpty(),
      body('post_newPassword', "Password must be 8 characters long and must contain atleast number and 1 special character")
      .isLength({min:8}),
      body('post_newPasswordAgain', "Passwords do not match")
      .isLength({min:8}).custom((value, {req})=>{
        return value == req.body.post_newPassword ;
      }),
    ],
    showValidationError,
    controllerAuth.postResetPasswordToken) ;




module.exports = router ;