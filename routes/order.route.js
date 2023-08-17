//Modules
const route= require('express').Router();

//Middleware
const uploadImage = require('../middelware/uploadFile')
const auth = require('../middelware/apiAuth')


//Controllers
const orderController = require('../controller/order.controller');

const cartController = require('../controller/cart.controller') 


//.......................................... routes  ...........................................

route.post('/create-order',auth.authUser,orderController.order);

route.get('/get-order-by-user',auth.authUser,orderController.getOrderByUser);

route.get('/get-dingle-order-by-user',auth.authUser,orderController.getOneOrderByUser)

route.get('/get-all-product-by-admin',auth.authAdmin,orderController.getAllOrderByAdmin);

route.get('/get-single-order-by-admin',auth.authAdmin,orderController.getOneOrderByAdmin)

route.delete('/cancel-order',auth.authUser,orderController.cancelOrder)


//..........................cart........................................

route.post('/add-cart',auth.authUser,cartController.AddCart);

route.get('/get-cart',auth.authUser,cartController.getCart);

route.delete('/remove-cart',auth.authUser,cartController.removeCart)

module.exports = route