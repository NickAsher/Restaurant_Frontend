const express = require('express') ;
const controllerMenu = require('../controllers/menu') ;
const router = express.Router() ;

router.get('/menu', controllerMenu.getMenu) ;
router.get('/item/:categoryId/:itemId', controllerMenu.getItem_ModalProduct) ;
router.get('/itemy/:categoryId/:itemId', controllerMenu.getItemDetail_DataOnly) ;


module.exports = router ;








