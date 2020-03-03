const Constants = require('../utils/Constants') ;
const dbRepository = require('../utils/DbRepository') ;
const crypto = require('crypto') ;
const checkoutUtils = require('../utils/checkout_utils') ;

const stripeSecret = 'sk_test_UyPRsL22aBZm7kClAIlz1NS500pYp4tBwn' ;
const stripePublic = 'pk_test_FPbfGF5aEyQqsBfsPytI46qw002ouxr0PP' ;
const stripe = require('stripe')(stripeSecret);

exports.getCheckoutPage = async (req, res)=>{
  try{
    let dbReturnData = await dbRepository.getUser_ById(req.session.userId) ;
    if (dbReturnData.status == false) {throw dbReturnData.data;}
    if (dbReturnData.data.length == 0) {throw `No such user in the database`;}
    let userData = dbReturnData.data['0'] ;

    res.render('checkout.hbs', {
      userData
    }) ;
  }catch (e) {
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


exports.postDevelopmentCheckoutPage = async (req, res)=>{
  try {
    let order = await makeOrderObject(req) ;
    order.paymentId = "Development" ;

    res.send({
      status: true,
      order
    });
  }catch (e) {
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

 async function makeOrderObject(req){
   let userId = req.session.userId;
   let orderId = crypto.createHash('md5').update(`${userId}-${Date.now()}`).digest('hex');
   let cart = req.body.backendCart;
   let price = await checkoutUtils.calculateCartPrice(cart);


   let order = {
     orderId,
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
     price: {
       netPrice: price,
       totalPrice: price
     },
   };
   return order ;
}



exports.postCheckoutPage = async (req, res)=>{
  try {
    let order = await makeOrderObject(req) ;


    let paymentIntent;
    if (req.body.payment_method_id) {
      // Create the PaymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        payment_method: req.body.payment_method_id,
        amount: order.price.totalPrice * 100,  // money is in paisa
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
    res.send(generateResponse(paymentIntent, order));
  } catch (e) {
    // Display error on client
    return res.send({ error: e.message });
  }
} ;






const generateResponse = (paymentIntent, order) => {
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
    //TODO add the order to db here and send the order id here
    order.paymentId = paymentIntent.id ;
    return {
      status : true,
      success: true,
      order
    };
  } else {
    // Invalid status
    return {
      status : false,
      error: 'Invalid PaymentIntent status'
    } ;
  }

};

