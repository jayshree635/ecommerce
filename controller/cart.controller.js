const Validator = require('validatorjs');
const db = require('../config/db.config');


//........................models.......................
const Cart = db.Cart;
const Product = db.product;
const User = db.User



const AddCart = async(req,res)=>{
    let validation = new Validator(req.body, {
        product_id: 'required', 
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };

    try {
        const {product_id} = req.body;
        const authUser = req.user;

        


    } catch (error) {
        console.log(error);
        return RESPONSE.error(res,9999)
    }
}


module.exports = {
    AddCart
}