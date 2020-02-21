const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const cookie = require('cookie') ;
const parseUtils = require('../utils/parse') ;





exports.getHomePage = async (req, res)=>{
  try{

    res.render('index-video.hbs', {

    }) ;
  }catch (e) {
    res.send({
      e : e.toString(),
      msg : "Beta ji koi to error hai"
    }) ;
  }

} ;

