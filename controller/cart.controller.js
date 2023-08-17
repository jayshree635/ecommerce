const Validator = require('validatorjs');
const db = require('../config/db.config');


//........................models.......................
const Cart = db.Cart;
const Product = db.product;
const User = db.User


//....................add cart.........................
const AddCart = async (req, res) => {
    let validation = new Validator(req.body, {
        product_id: 'required',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };

    try {
        const { product_id } = req.body;
        const authUser = req.user;

        const isExistProductId = await Product.findOne({ where: { id: product_id } })
        if (!isExistProductId) {
            return RESPONSE.error(res, 1307)
        }

        const isExistItem = await Cart.findOne({ where: { product_id, user_id: authUser.id } });
        if (isExistItem) {
            return RESPONSE.error(res, 1602)
        }

        const cartData = await Cart.create({ product_id, user_id: authUser.id })
        return RESPONSE.success(res, 1601, cartData)

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//...................get cart ...................
const getCart = async (req, res) => {
    try {
        const authUser = req.user;

        const cartData = await Cart.findAll({ where: { user_id: authUser.id } });
        if (!cartData) {
            return RESPONSE.error(res, 1604)
        }

        return RESPONSE.error(res, 1603, cartData)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//...............remove cart...................
const removeCart = async (req, res) => {
    let validation = new Validator(req.body, {
        id: 'required',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };
    try {
        const authUser = req.user;
        const { id } = req.body;

        const cartData = await Cart.findOne({ where: { id: id, user_id: authUser.id } });
        if (!cartData) {
            return RESPONSE.error(res, 1604)
        }

        await Cart.destroy({ where: { id: id } })

        return RESPONSE.success(res, 1605)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}
module.exports = {
    AddCart,
    getCart,
    removeCart
}