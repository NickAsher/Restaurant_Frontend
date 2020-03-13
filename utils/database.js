const mysql = require('mysql2') ;
require('dotenv').config() ;

const pool = mysql.createPool({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  database : 'restaurant',
  password : process.env.DB_PASSWORD,
  namedPlaceholders:true
}) ;



module.exports = pool.promise() ;