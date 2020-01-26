const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;


exports.getAllBlogs = async (req, res)=>{
  try{

    let blogsData = await dbRepository.getAllBlogs() ;
    if(blogsData['status'] === false){
      throw new Error(blogsData) ;
    }
    res.render('blogs_all.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items,
      blogsData : blogsData['data']
    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;

exports.getSingleBlog = async (req, res)=>{
  try{
    let blogData = await dbRepository.getSingleBlog(req.params.blogId) ;
    if(blogData['status'] === false){
      throw new Error(blogData) ;
    }
    res.render('blog_single.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items,
      blogData : blogData['data']['0'],
    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;


