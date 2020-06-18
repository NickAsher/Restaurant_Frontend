const path = require('path') ;

const IMAGE_BACKENDFRONT_LINK_PATH  = process.env.NODE_ENV == 'production' ? "https://s3.ap-south-1.amazonaws.com/rafique.in/restaurant-backend/images/" : "http://localhost:3002/public_images/" ;
const SERVER_LOCATION = process.env.NODE_ENV == 'production' ? 'https://www.gagneja.rafique.in' : 'http://localhost:3000' ;
const PUBLIC_DIRECTORY_LOCATION = process.env.NODE_ENV == 'production' ? 'https://s3.ap-south-1.amazonaws.com/rafique.in/restaurant-frontend/public' : '' ;


module.exports = {
  SERVER_LOCATION,
  IMAGE_BACKENDFRONT_LINK_PATH,
  PUBLIC_DIRECTORY_LOCATION
} ;