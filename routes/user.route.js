//Modules
const route= require('express').Router();

//Middleware
const uploadImage = require('../middelware/uploadFile')
const auth = require('../middelware/apiAuth')


//Controllers
const user = require('../controller/user.controller');



//.......................................... routes  ...........................................

route.post('/sign-up',uploadImage.uploadImage('profileImages','profile_image'),user.signUp);

route.post('/email-verify',user.emailVerify);

route.post('/login',user.login);

route.get('/get-user-profile',auth.authUser,user.getUserProfile);

route.patch('/update-profile',auth.authUser,uploadImage.uploadImage('profileImages','profile_image'),user.updateProfile);

route.delete('/logout',auth.authUser,user.logout);

route.delete('/delete-user',auth.authUser,user.deleteUser);

module.exports = route