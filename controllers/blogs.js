const request = require('request-promise') ;
const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;
const Paginator = require('../utils/Paginator') ;



exports.getAllBlogs_Paginated = async (req, res)=>{
  try{
    let totalNoOfItems = parseInt((await dbRepository.getBlogCount()).data);
    let itemsPerPage  = 7;
    let myPaginator = new Paginator(totalNoOfItems, itemsPerPage, req.query.page) ;
    let parsedPaginatorHtml = myPaginator.getPaginatedHTML("") ;

    let blogsData = await dbRepository.getBlogs_Paginated(myPaginator.getPageNo(), itemsPerPage) ;
    if(blogsData['status'] === false){throw blogsData ;}

    res.render('blogs_all.hbs', {
      blogsData : blogsData['data'],
      parsedPaginatorHtml,
    }) ;
  }catch (e) {
    res.send({
      e : e.message
    }) ;
  }
} ;




exports.getSingleBlog = async (req, res)=>{
  try{
    let blogData = await dbRepository.getSingleBlog(req.params.blogId) ;
    if(blogData['status'] === false){throw blogData ;}

    res.render('blog_single.hbs', {
      blogData : blogData['data']['0'],
    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;


