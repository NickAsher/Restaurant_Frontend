const path = require('path') ;

const IMAGE_FRONTEND_LINK_PATH = "http://localhost:3000/images/" ;
const VIDEO_FRONTEND_LINK_PATH = "http://localhost:3000/videos/" ;
const IMAGE_BACKENDFRONT_LINK_PATH  = process.env.NODE_ENV == 'production' ? "https://s3.ap-south-1.amazonaws.com/rafique.in/restaurant-backend/images/" : "http://localhost:3002/public_images/" ;
const API_ROOT_PATH = "http://localhost:8080/RestaurantApi/apis/" ;
const API_ROOTH_PATH_NEW = "http://localhost:3001" ;



module.exports = {
  IMAGE_FRONTEND_LINK_PATH,
  VIDEO_FRONTEND_LINK_PATH,
  IMAGE_BACKENDFRONT_LINK_PATH,
  API_ROOT_PATH,
  API_ROOTH_PATH_NEW,
} ;