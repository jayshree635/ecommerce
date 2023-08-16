const Validator = require('validatorjs');
const db = require('../config/db.config');


//...........models
const product_categories = db.Product_categories;

//..............add product_categories...................
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

//................get all product_categories by admin...................
const getAllProduct_categories = async (req, res) => {
    try {
        const authAdmin = req.user;
        if (!authAdmin) {
            return RESPONSE.error(res, 1105)
        }

        const allCategories = await product_categories.findAll();

        return RESPONSE.success(res, 1202, allCategories)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//....................get all product categories by user.............
const getAllCategoriesByUser = async (req, res) => {
    try {
        const authUser = req.user;
        if (!authUser) {
            return RESPONSE.error(res, 1018)
        }

        const allCategories = await product_categories.findAll();

        return RESPONSE.success(res, 1202, allCategories)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


const updateProductCategories = async (req, res) => {
    let validation = new Validator(req.body, {
        name: 'required|string|max:50',
        category_id: 'required'
    })
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const authAdmin = req.user;
        const { name, category_id } = req.body;

        if (!authAdmin) {
            return RESPONSE.error(res, 1105)
        }

        const isExist = await product_categories.findOne({ where: { id: category_id } });
        if (!isExist) {
            return RESPONSE.error(res, 1204)
        }

        const updateData = await product_categories.update({ name }, { where: { id: isExist.id } });
        return RESPONSE.success(res, 1205, updateData)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}
module.exports = {
    addProductCategory,
    getAllProduct_categories,
    getAllCategoriesByUser,
    updateProductCategories
}