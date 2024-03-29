const Constants = require('../utils/Constants') ;
const dbRepository = require('../data/DbRepository') ;
const crypto = require('crypto') ;
const checkoutUtils = require('../utils/checkout_utils') ;
require('dotenv').config() ;
const fs = require('fs') ;
const logger = require('../middleware/MiddlewareLogging') ;
const orderParseUtils = require('../utils/order_parse_utils') ;
const emailUtils = require('../utils/email') ;


const stripePublic = 'pk_test_FPbfGF5aEyQqsBfsPytI46qw002ouxr0PP' ;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutPage = async (req, res)=>{
  console.log("this is checkout page") ;
  try{
    let dbReturnData = await dbRepository.getUser_ById(req.session.userId) ;
    if (dbReturnData.status == false) {throw dbReturnData;}
    let userData = dbReturnData.data ;

    res.render('checkout.hbs', {
      userData
    }) ;
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.status(500).render('error.hbs', {
      showBackLink : true,
      backLink : "/",
      error : e
    }) ;
  }
} ;

async function makeOrderObject(req){
  let userId = req.session.userId;
  let cart = req.body.backendCart;
  let price = await checkoutUtils.calculateCartPrice(cart);

  let order = {
    userId,
    userDetails:{
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      email : req.body.email,
      phone : req.body.phone
    },
    address: {
      addressLine1 : req.body.addressLine1,
      addressLine2 : req.body.addressLine2,
      addressLine3 : req.body.addressLine3
    },
    cart,
    totalPrice : price,
    comments : req.body.comments
  };
  return order ;
}


exports.postDevelopmentCheckoutPage = async (req, res)=>{
  try {
    let order = await makeOrderObject(req) ;
    order.paymentData = {
      id : "Development",
      brand : "Development",
      last4 : "Development"
    }  ;

    let dbReturnData = await dbRepository.insertOrder(order) ;

    // sending the order successful email.
    let menuNameData = await orderParseUtils.getMenuNameData() ;
    let cartDescription = await orderParseUtils.parseInvoiceFromBackendCart(menuNameData, order.cart) ; // this is an array
    cartDescription.push({
      item : '<b>TOTAL</b>',
      description : '',
      price : `<b>${order.totalPrice}</b>`
    }) ;

    emailUtils.sendOrderSuccessMail(order.userDetails.email, dbReturnData.data.insertId,
      `${order.userDetails.firstname} ${order.userDetails.lastname}`, cartDescription) ;

    res.send({
      status: true,
      orderId : dbReturnData.data.insertId
    });
  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    res.send({
      status : false,
      e,
      e_message : e.message,
      e_toString : e.toString(),
      e_toString2 : e.toString,
      yo : "Beta ji koi error hai"
    }) ;
  }
} ;





exports.postCheckoutPage = async (req, res)=>{
  try {
    let order = await makeOrderObject(req) ;

    let paymentIntent;
    if (req.body.payment_method_id) {
      // Create the PaymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        payment_method: req.body.payment_method_id,
        amount: order.totalPrice * 100,  // money is in paisa
        currency: 'inr',
        confirmation_method: 'manual',
        confirm: true
      });
    } else if (req.body.payment_intent_id) {
      paymentIntent = await stripe.paymentIntents.confirm(
        req.body.payment_intent_id
      );
    }
    // Send the response to the client
    res.send(await generateResponse(paymentIntent, order));
  } catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'url':'${req.originalUrl}'}`) ;
    return res.send({ error: e.message });
  }
} ;






const generateResponse = async (paymentIntent, order) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (paymentIntent.status === 'requires_action' && paymentIntent.next_action.type === 'use_stripe_sdk') {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: paymentIntent.client_secret
    };
  } else if (paymentIntent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    let cardData = paymentIntent.charges.data['0'].payment_method_details.card ;

    order.paymentData = {
      id: paymentIntent.id,
      brand: cardData.brand,
      last4: cardData.last4
    };
    let dbReturnData = await dbRepository.insertOrder(order) ;
    if(dbReturnData.status != true){throw dbReturnData;}

    // sending the order successful email.
    let menuNameData = await orderParseUtils.getMenuNameData() ;
    let cartDescription = await orderParseUtils.parseInvoiceFromBackendCart(menuNameData, order.cart) ; // this is an array
    cartDescription.push({
      item : '<b>TOTAL</b>',
      description : '',
      price : `<b>${order.totalPrice}</b>`
    }) ;

    emailUtils.sendOrderSuccessMail(order.userDetails.email, dbReturnData.data.insertId,
      `${order.userDetails.firstname} ${order.userDetails.lastname}`, cartDescription) ;


    return {
      status : true,
      orderId : dbReturnData.data.insertId,

    };
  } else {
    // Invalid status

    logger.error(`{'error' : 'Payment error', 'paymentIntent':'${JSON.stringify(paymentIntent)}'}`) ;
    return {
      status : false,
      error: 'Invalid PaymentIntent status'
    } ;
  }

};

