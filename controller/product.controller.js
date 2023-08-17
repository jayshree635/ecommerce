const Validator = require('validatorjs');
const db = require('../config/db.config');
const path = require('path')


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

        const findProduct = await Product.findOne({
            where: { id: productData.id },
            include: [
                {
                    model: product_images,
                    attributes: ['product_image', 'id']
                }
            ]
        });

        return RESPONSE.success(res, 1301, findProduct)
    } catch (error) {
        await trans.rollback()
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//................get all product by admin...................
const getAllProducts = async (req, res) => {
    try {
        const authAdmin = req.user;
        if (!authAdmin) {
            return RESPONSE.error(res, 1105)
        }

        const allProducts = await Product.findAll({
            include: [
                {
                    model: product_images,
                    attributes: ['id', 'product_id', 'product_image']

                }
            ]
        }
        );
        if (!allProducts) {
            return RESPONSE.error(res, 1307)
        }
        return RESPONSE.success(res, 1202, allProducts)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//........................get single product by admin..........
const getOneProductsByAdmin = async (req, res) => {
    try {
        const authAdmin = req.user;
        const product_id = req.query.product_id
        if (!authAdmin) {
            return RESPONSE.error(res, 1105)
        }

        const allProducts = await Product.findOne({
            where: { id: product_id },
            include: [
                {
                    model: product_images,
                    attributes: ['id', 'product_id', 'product_image']

                }
            ]
        });
        if (!allProducts) {
            return RESPONSE.error(res, 1307)
        }
        return RESPONSE.success(res, 1202, allProducts)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//....................get all product  by user.............
const getAllProductsByUser = async (req, res) => {
    try {
        const authUser = req.user;
        if (!authUser) {
            return RESPONSE.error(res, 1018)
        }

        const allProducts = await Product.findAll(
            {
                include: [
                    {
                        model: product_images,
                        attributes: ['id', 'product_id', 'product_image']

                    }
                ]
            }
        );
        if (!allProducts) {
            return RESPONSE.error(res, 1307)
        }

        return RESPONSE.success(res, 1202, allProducts)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


const getOneProductsByUser = async (req, res) => {
    try {
        const authUser = req.user;
        const id = req.query.id

        if (!authUser) {
            return RESPONSE.error(res, 1105)
        }

        const allProducts = await Product.findOne({
            where: { id:id},
            include: [
                {
                    model: product_images,
                    attributes: ['id',  'product_image']

                }
            ]
        });
        if (!allProducts) {
            return RESPONSE.error(res, 1307)
        }
        return RESPONSE.success(res, 1202, allProducts)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}
//................update product...........................

const updateProduct = async (req, res) => {
    let validation = new Validator(req.body, {
        title: 'string|max:50',
        description: 'string|max:200',
        price: 'numeric|min:0',
        quantity: 'numeric|min:0',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    }

    let trans = await db.sequelize.transaction();
    try {
        const { title, description, price, quantity, product_categories_id } = req.body;
        const product_image = req?.files;
        const authAdmin = req.user;
        const product_id = req.query.product_id;

        if (!authAdmin) {
            await trans.rollback();
            return RESPONSE.error(res, 1105);
        }

        const object = {
            title,
            description,
            price,
            quantity,
            product_categories_id
        }

        const findProduct = await Product.findOne({
            where: { id: product_id },
            include: [
                {
                    model: product_images,
                    attributes: ['product_image', 'id']
                }
            ]
        });

        if (!findProduct) {
            await trans.rollback();
            return RESPONSE.error(res, 1307);
        }

        if (findProduct.product_images) {

            for (const image of findProduct.product_images) {
                await product_images.destroy({ where: { id: image.id }, transaction: trans })
                await FILEACTION.deleteFile(path.basename(image.product_image), 'images/productImages');
            }

            for (const image of product_image) {
                await product_images.create(
                    {
                        product_image: image.filename,
                        product_id: product_id
                    },
                    { where: { id: image.id }, transaction: trans }
                );
            }
        }

        const updatedData = await Product.update(object, { where: { id: product_id }, transaction: trans });

        await trans.commit();

        return RESPONSE.success(res, 1305, updatedData);
    } catch (error) {
        await trans.rollback();
        console.log(error);
        return RESPONSE.error(res, 9999);
    }
};


//.....................delete product..................
const deleteProduct = async (req, res) => {

    let trans = await db.sequelize.transaction();
    try {
        const authAdmin = req.user;
        const product_id = req.query.product_id;

        if (!authAdmin) {
            return RESPONSE.error(res, 1105)
        }

        const findProduct = await Product.findOne({
            where: { id: product_id },
            include: [
                {
                    model: product_images,
                    attributes: ['product_image', 'id']
                }
            ]
        });

        if (!findProduct) {
            await trans.rollback()
            return RESPONSE.error(res, 1307)
        }

        if (findProduct.product_images.length) {

            for (const image of findProduct.product_images) {
                await product_images.destroy({ where: { id: image.id }, transaction: trans })
                await FILEACTION.deleteFile(path.basename(image.product_image), 'images/productImages');

            }
        }

        await Product.destroy({ where: { id: product_id }, transaction: trans })

        await trans.commit()
        return RESPONSE.success(res, 1304)
    } catch (error) {
        await trans.rollback()
        console.log(error);
        return RESPONSE.error(res, 9999);
    }
}
module.exports = {
    addProduct,
    getAllProducts,
    getAllProductsByUser,
    updateProduct,
    deleteProduct,
    getOneProductsByAdmin,
    getOneProductsByUser
}