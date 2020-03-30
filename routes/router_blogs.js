const express = require('express') ;
const controllerBlogs = require('../controllers/blogs') ;
const router = express.Router() ;

router.get('/blogs', controllerBlogs.getAllBlogs_Paginated) ;
router.get('/blog/:blogId', controllerBlogs.getSingleBlog) ;

module.exports = router ;