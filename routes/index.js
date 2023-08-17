const route= require('express').Router();

//................route...........
const UserRoute = require('./user.route');
const AdminRoute = require('./admin.route')
const productRoute = require('./product.route');
const orderRoute = require('./order.route');

route.use('/user',UserRoute)
route.use('/admin',AdminRoute)
route.use('/product',productRoute)
route.use('/order',orderRoute)

module.exports = route