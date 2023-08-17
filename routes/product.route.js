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

route.get('/all-categories-user',auth.authUser,product_categoriesController.getAllProduct_categories);

route.patch('/update-product-categories',auth.authAdmin,product_categoriesController.updateProductCategories);

route.delete('/delete-product-categories',auth.authAdmin,product_categoriesController.deleteProductCategories)


//...................product...............
route.post('/add-product',auth.authAdmin,uploadImage.uploadMultipleImage('productImages','product_image'),productController.addProduct);

route.get('/get-all-product',auth.authAdmin,productController.getAllProducts)

route.get('/get-all-product-user',auth.authUser,productController.getAllProductsByUser)

route.patch('/update-product',auth.authAdmin,uploadImage.uploadMultipleImage('productImages','product_image'),productController.updateProduct);

route.delete('/delete-product',auth.authAdmin,productController.deleteProduct)

module.exports = route