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


exports.postCheckoutPage = async (req, res)=>{
  try {
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
      payment: "some paymentId"

    };
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


exports.makePayment = async (req, res)=>{
  try{

    const { paymentMethodId, paymentIntentId, items, currency, useStripeSdk } = req.body;
    let orderAmount = 1 ;// TODO will be calculated from the cart though ;
    console.log(paymentMethodId, paymentIntentId, items, currency, useStripeSdk) ;

    let paymentIntent ;
    if(paymentMethodId){
      paymentIntent = await stripe.paymentIntents.create({
        amount: orderAmount,
        currency: 'inr',
        payment_method: paymentMethodId,
        confirmation_method: "manual",
        confirm: true,
        // If a mobile client passes `useStripeSdk`, set `use_stripe_sdk=true`
        // to take advantage of new authentication features in mobile SDKs
        use_stripe_sdk: useStripeSdk,
      });

    }else{
      // Confirm the PaymentIntent to finalize payment after handling a required action
      // on the client.
      paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      // After confirm, if the PaymentIntent's status is succeeded, fulfill the order.
    }

    res.send(generateResponse(paymentIntent)) ;

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



const generateResponse = intent => {
  // Generate a response based on the intent's status
  switch (intent.status) {
    case "requires_action":
    case "requires_source_action":
      // Card requires authentication
      return {
        requiresAction: true,
        clientSecret: intent.client_secret
      };
    case "requires_payment_method":
    case "requires_source":
      // Card was not properly authenticated, suggest a new payment method
      return {
        error: "Your card was denied, please provide a new payment method"
      };
    case "succeeded":
      // Payment is complete, authentication not required
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      console.log("💰 Payment received!");
      return { clientSecret: intent.client_secret };
  }
};

