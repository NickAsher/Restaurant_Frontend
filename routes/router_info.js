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


//TODO make the order page
router.get('/order', async (req, res)=>{
  try{
    res.render('order_success2.hbs') ;
  }catch (e) {
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
}) ;

router.get('/order/:orderId', [
  param('orderId', "Invalid OrderId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape()
], showValidationError, controllerInfo.getOrderInfoPage) ;

module.exports = router ;