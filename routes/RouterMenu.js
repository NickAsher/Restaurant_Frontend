const express = require('express') ;
const controllerMenu = require('../controllers/ControllerMenu') ;
const {param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/MiddlewareValidation') ;

const router = express.Router() ;
const showValidationError = validationMiddleware.showValidationError ;

router.get('/menu', controllerMenu.getMenu) ;
router.get('/item/:categoryId/:itemId', [
  param('categoryId', "Invalid CategoryId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  param('itemId', "Invalid ItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape()
], showValidationError,controllerMenu.getItem_ModalProduct) ;


router.get('/itemy/:categoryId/:itemId', [
  param('categoryId', "Invalid CategoryId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape(),
  param('itemId', "Invalid ItemId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape()
], showValidationError,controllerMenu.getItemDetail_DataOnly) ;


module.exports = router ;








