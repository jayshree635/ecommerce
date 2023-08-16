//Modules
const route= require('express').Router();

//Middleware
const uploadImage = require('../middelware/uploadFile')
const auth = require('../middelware/apiAuth')


//Controllers

const productController = require('../controller/product.controller')

const product_categoriesController = require('../controller/product_categories.controller')




//.......................................... routes  ...........................................

//...................product_categories.......
route.post('/add-product-categories',auth.authAdmin,product_categoriesController.addProductCategory);

route.get('/all-product-categories',auth.authAdmin,product_categoriesController.getAllProduct_categories);

route.get('/all-categories-ByUser',auth.authUser,product_categoriesController.getAllProduct_categories);

route.patch('/update-product-categories',auth.authAdmin,product_categoriesController.updateProductCategories)

//...................product...............
route.post('/add-product',auth.authAdmin,uploadImage.uploadMultipleImage('productImages','product_image'),productController.addProduct)


module.exports = route