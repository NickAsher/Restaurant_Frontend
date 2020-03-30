const {body, param, validationResult} = require('express-validator') ;
const path = require('path') ;
const fs = require('fs') ;
const Constants = require('../utils/Constants') ;
const logger = require('./logging') ;



exports.showValidationError = (req, res, next)=>{
  const errors = validationResult(req) ;

  if (!errors.isEmpty()) {
    logger.warn(`{'warn' : ${(JSON.stringify(errors.array()))} ,'url':'${req.originalUrl}'}`) ;
    return res.status(422).send({
      status:false,
      error : errors.array()
    });
  } else {
    next() ;
  }
} ;







