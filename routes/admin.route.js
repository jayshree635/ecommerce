//Modules
const route = require('express').Router();

//Middleware
const uploadImage = require('../middelware/uploadFile')
const auth = require('../middelware/apiAuth')


//Controllers
const AdminController = require('../controller/admin.controller');

const productController = require('../controller/product.controller')




//.......................................... routes  ...........................................

route.post('/admin-login', AdminController.adminLogin);

route.get('/get-profile', auth.authAdmin, AdminController.getAdminProfile);

route.patch('/update-admin-profile', auth.authAdmin, uploadImage.uploadImage('profileImages', 'profile_image'), AdminController.updateAdminProfile)

route.delete('/logout-admin', auth.authAdmin, AdminController.AdminLogout)



module.exports = route