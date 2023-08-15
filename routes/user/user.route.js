const route= require('express').Router();
const user = require('../../controller/user/user.controller');
const uploadImage = require('../../middelware/uploadFile')

//..............routes

route.post('/sign-up',uploadImage.uploadImage('profileImages','profile_image'),user.signUp)

route.post('/email-verify',user.emailVerify)
module.exports = route