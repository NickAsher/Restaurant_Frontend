const mysql = require('mysql2') ;
require('dotenv').config() ;
const Constants = require('./Constants') ;

let host, user, password ;
if(process.env.NODE_ENV == 'development'){
  host = process.env.DB_HOST ;
  user = process.env.DB_USER ;
  password = process.env.DB_PASSWORD ;
}else if(process.env.NODE_ENV == 'production'){
  host = process.env.DB_HOST_PRODUCTION ;
  user = process.env.DB_USER_PRODUCTION ;
  password = process.env.DB_PASSWORD_PODUCTION ;
}

const pool = mysql.createPool({
  host : host,
  user : user,
  database : Constants.DATABASE_NAME,
  password : password,
  namedPlaceholders:true
}) ;



module.exports = pool.promise() ;