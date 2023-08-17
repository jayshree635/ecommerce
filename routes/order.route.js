//Modules
const route= require('express').Router();

//Middleware
const uploadImage = require('../middelware/uploadFile')
const auth = require('../middelware/apiAuth')


//Controllers
const orderController = require('../controller/order.controller');



//.......................................... routes  ...........................................

route.post('/create-order',auth.authUser,orderController.order)


module.exports = route