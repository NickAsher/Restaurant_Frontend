const express = require('express') ;
const controllerInfo = require('../controllers/info') ;
const router = express.Router() ;

router.get('/', controllerInfo.getHomePage) ;
router.get('/about', controllerInfo.getAboutUsData) ;
router.get('/contact', controllerInfo.getContactUsData) ;
router.get('/gallery', controllerInfo.getAllGalleryItems) ;
router.get('/specials', controllerInfo.getOfferSpecialsData) ;
router.get('/order/:orderId', controllerInfo.getOrderInfoPage) ;

module.exports = router ;