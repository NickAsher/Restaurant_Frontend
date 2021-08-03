const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../data/DbRepository') ;
const Paginator = require('../utils/Paginator') ;
const logger = require('../middleware/MiddlewareLogging') ;
const moment = require('moment') ;



exports.getAllBlogs_Paginated = async (req, res)=>{
  try{
    let totalNoOfItems = parseInt((await dbRepository.getBlogCount()).data);
    let itemsPerPage  = 7;
    let myPaginator = new Paginator(totalNoOfItems, itemsPerPage, req.query.page) ;
    let parsedPaginatorHtml = myPaginator.getPaginatedHTML("") ;

    let dbBlogsData = await dbRepository.getBlogs_Paginated(myPaginator.getPageNo(), itemsPerPage) ;
    if(dbBlogsData['status'] == false){throw dbBlogsData ;}

    let blogsData = dbBlogsData['data'] ;
    blogsData.forEach((blog)=>{
      blog.blog_creation_date = moment(blog.blog_creation_date).format('Do MMM, YYYY') ;
    }) ;

    res.render('blogs_all.hbs', {
      blogsData,
      parsedPaginatorHtml,
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.status(500).render('error.hbs', {
      showBackLink : true,
      backLink : "/",
      error : e
    }) ;
  }
} ;




exports.getSingleBlog = async (req, res)=>{
  try{
    let dbBlogData = await dbRepository.getSingleBlog(req.params.blogId) ;
    if(dbBlogData['status'] == false){throw dbBlogData ;}

    let blogData = dbBlogData['data'] ;
    blogData.blog_creation_date = moment(blogData.blog_creation_date).format('Do MMM, YYYY') ;
    res.render('blog_single.hbs', {
      blogData ,
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.status(500).render('error.hbs', {
      showBackLink : true,
      backLink : "/",
      error : e
    }) ;
  }
} ;


