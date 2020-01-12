const request = require('request-promise') ;
const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;



exports.getMenu = async (req, res)=>{


  try{
    let menuData = await dbRepository.getAllMenuItems_SeperatedByCategory() ;

    res.render('menu/menu.hbs', {
      IMAGE_FRONTEND_LINK_PATH : Constants.IMAGE_FRONTEND_LINK_PATH,
      IMAGE_BACKENDFRONT_LINK_PATH : Constants.IMAGE_BACKENDFRONT_LINK_PATH,
      menuData : menuData['data'],
    }) ;

  }catch (e) {
    res.send(e) ;
  }
};




