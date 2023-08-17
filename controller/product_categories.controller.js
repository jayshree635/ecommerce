const Validator = require('validatorjs');
const db = require('../config/db.config');


//...........models............
const Product_categories = db.Product_categories;

//..............add Product_categories...................
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

        const productCategory = await Product_categories.create({ name });

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

        const allCategories = await Product_categories.findAll();
        if (!allCategories) {
            return RESPONSE.error(res, 1204)
        }

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

        const allCategories = await Product_categories.findAll();
        if (!allCategories) {
            return RESPONSE.error(res, 1204)
        }

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

        const isExist = await Product_categories.findOne({ where: { id: category_id } });
        if (!isExist) {
            return RESPONSE.error(res, 1204)
        }

        const updateData = await Product_categories.update({ name }, { where: { id: isExist.id } });
        return RESPONSE.success(res, 1205, updateData)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//.......................delete Product_categories....................//
const deleteProductCategories = async (req, res) => {
    try {
        const authAdmin = req.user;
        const product_categories_id = req.query.product_categories_id;
        if (!authAdmin) {
            return RESPONSE.error(res, 1105)
        }

        const findCategories = await Product_categories.findOne({ where: { id: product_categories_id } });
        if (!findCategories) {
            return RESPONSE.error(res, 1204)
        }
 
         await Product_categories.destroy({where : {id : product_categories_id}})

        return RESPONSE.success(res,1205 )
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}
module.exports = {
    addProductCategory,
    getAllProduct_categories,
    getAllCategoriesByUser,
    updateProductCategories,
    deleteProductCategories
}