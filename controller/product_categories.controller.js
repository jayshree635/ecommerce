const Validator = require('validatorjs');
const db = require('../config/db.config');


//...........models
const product_categories = db.Product_categories;


const addProductCategory = async (req, res) => {
    let validation = new Validator(req.body, {
        name: 'required|string|max:50',
    })
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const authAdmin = req.user;
        if (!authAdmin) {
            return RESPONSE.error(res, 1105)
        }
        const { name } = req.body;

        const productCategory = await product_categories.create({ name });


        return RESPONSE.success(res, 1201, productCategory)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


module.exports = {
    addProductCategory
}