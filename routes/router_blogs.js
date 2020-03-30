const express = require('express') ;
const {param, validationResult} = require('express-validator') ;
const validationMiddleware = require('../middleware/validation') ;
const controllerBlogs = require('../controllers/blogs') ;


const router = express.Router() ;
const showValidationError = validationMiddleware.showValidationError ;


router.get('/blogs', controllerBlogs.getAllBlogs_Paginated) ;

router.get('/blog/:blogId', [
    param('blogId', "Invalid BlogId").exists().notEmpty().isNumeric({no_symbols: true}).trim().escape()
  ], showValidationError, controllerBlogs.getSingleBlog) ;

module.exports = router ;