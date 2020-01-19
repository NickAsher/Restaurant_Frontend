const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;

exports.getAllBlogs = async (req, res)=>{
  try{
    let requestData =   await request(Constants.API_ROOTH_PATH_NEW + "/blogs") ;
    if(requestData['status'] == false){
      throw new Error(requestData["error_msg"]) ;
    }
    let blogsArray = JSON.parse(requestData)['data'] ;

    res.render('blogs/blogs.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      blogsArray
    }) ;
  }catch (e) {
    res.send(e) ;

  }
};

exports.getSpecificBlog = async (req, res)=>{
  try{
    let blogId = req.params.blogId ;

    let requestData = await request(Constants.API_ROOTH_PATH_NEW + "/blogs/" + blogId) ;
    if(requestData['status'] == false){
      throw new Error(requestData["error_msg"]) ;
    }

    let blogData = JSON.parse(requestData)['data'] ;

    res.render('blogs/specific_blog.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,

      BLOG_TITLE : blogData['blog_title'],
      BLOG_IMAGE_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH + blogData['blog_display_image'],
      BLOG_CONTENT : blogData['blog_content']
    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;



exports.getAllBlogs2 = async (req, res)=>{
  try{

    let blogsData = await dbRepository.getAllBlogs() ;
    if(blogsData['status'] === false){
      throw new Error(blogsData) ;
    }
    res.render('blogs_all.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
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
      blogData : blogData['data']['0'],
    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;


