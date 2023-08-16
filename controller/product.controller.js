const Validator = require('validatorjs');
const db = require('../config/db.config');


//...............models..........
const Product = db.product;
const product_images = db.Product_images;


//................add product.............
const addProduct = async (req, res) => {
    let validation = new Validator(req.body, {
        title: 'required|max:100',
        description: 'required|max:200',
        price: 'required|numeric|min:0',
        quantity: 'required|numeric|min:0',
        product_categories_id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }

    let trans = await db.sequelize.transaction();
    try {
        const { title, description, price, quantity, product_categories_id } = req.body;
        const product_image = req?.files;

        const authAdmin = req.user;
        if (!authAdmin) {
            await trans.rollback()
            return RESPONSE.error(res, 1105);
        }

        const productData = await Product.create({
            title, description, price, quantity, product_categories_id
        }, { transaction: trans });

        for (const image of product_image) {
            await product_images.create({
                product_id: productData.id,
                product_image: image.filename
            }, { transaction: trans })
        }

        await trans.commit();

        return RESPONSE.success(res, 1301, productData)
    } catch (error) {
        await trans.rollback()
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}




module.exports = {
    addProduct,
}