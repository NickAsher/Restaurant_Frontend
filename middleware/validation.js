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

exports.customValidation_Password = (value)=>{
  return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these A-Z  a-z 0-9 ! - _ . @
    && /[A-Z]/.test(value) // must have an uppercase letter
    && /[a-z]/.test(value) // must have a lowercase letter
    && /\d/.test(value) ;// must have a digit
} ;







