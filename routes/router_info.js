const express = require('express') ;
const controllerInfo = require('../controllers/info') ;
const {param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;

const router = express.Router() ;
const showValidationError = validationMiddleware.showValidationError ;

router.get('/', controllerInfo.getHomePage) ;
router.get('/about', controllerInfo.getAboutUsData) ;
router.get('/contact', controllerInfo.getContactUsData) ;
router.get('/gallery', controllerInfo.getAllGalleryItems) ;
router.get('/specials', controllerInfo.getOfferSpecialsData) ;
router.get('/order', controllerInfo.getOrderPage) ;


module.exports = router ;