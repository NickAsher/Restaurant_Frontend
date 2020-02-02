const request = require('request-promise') ;
const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;
const parseUtils = require('../utils/parse') ;
const Paginator = require('../utils/Paginator') ;



exports.getAllBlogs_Paginated = async (req, res)=>{
  try{

    let dbHelper = JSON.parse(fs.readFileSync(__dirname + '/../utils/dbHelper.json')) ;

    let totalNoOfItems = dbHelper.total_blog_items ;
    let itemsPerPage  = 10 ;
    let myPaginator = new Paginator(totalNoOfItems, itemsPerPage, req.query.page) ;
    let parsedPaginatorHtml = myPaginator.getPaginatedHTML("") ;

    let blogsData = await dbRepository.getBlogs_Paginated(myPaginator.getPageNo(), itemsPerPage) ;
    if(blogsData['status'] === false){throw blogsData ;}

    let parsedCartData = parseUtils.getCart_Parsed(req.cookies.cart) ;
    if(parsedCartData.status == false){throw parsedCartData ;}

    res.render('blogs_all.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items || '0',
      blogsData : blogsData['data'],
      cartData : parsedCartData.cartData,
      totalPrice : parsedCartData.totalPrice,
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

    let parsedCartData = parseUtils.getCart_Parsed(req.cookies.cart) ;
    if(parsedCartData.status == false){throw parsedCartData ;}

    res.render('blog_single.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      TOTAL_CART_ITEMS : req.cookies.total_items || '0',
      blogData : blogData['data']['0'],
      cartData : parsedCartData.cartData,
      totalPrice : parsedCartData.totalPrice,
    }) ;
  }catch (e) {
    res.send(e) ;
  }
} ;


