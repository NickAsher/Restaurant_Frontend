const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;


exports.getCheckoutPage = async (req, res)=>{
  try{
    res.render('checkout.hbs') ;
  }catch (e) {
    res.send({
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;

