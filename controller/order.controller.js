const Validator = require('validatorjs');
const db = require('../config/db.config');
const randomstring = require('randomstring');
const { where, or } = require('sequelize');

//...........models..........
const Order = db.Order;
const User = db.User;
const Product = db.product;
const Product_images = db.Product_images;
const Cart = db.Cart;

//.................order API ........................//

const order = async (req, res) => {
    let validation = new Validator(req.body, {
        product_id: 'required',
        quantity: 'required|numeric|min:1'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };
    let trans = await db.sequelize.transaction()
    try {
        const authUser = req.user
        const { product_id, quantity } = req.body;

        let order_id = randomstring.generate({
            length: 15,
            charset: 'alphanumeric'
        });

        let isExistOrderId = await Order.findOne({ where: { order_id } });

        while (isExistOrderId) {
            order_id = randomstring.generate({
                length: 15,
                charset: 'alphanumeric'
            });
            isExistOrderId = await Order.findOne({ where: { order_id } });
        }

        const isExistProductId = await Product.findOne({ where: { id: product_id } })
        if (!isExistProductId) {
            await trans.rollback()
            return RESPONSE.error(res, 1307)
        }

        if (isExistProductId.quantity < quantity) {
            await trans.rollback()
            return RESPONSE.error(res, 1308)
        }

        const paid_Amount = isExistProductId.price * quantity;

        const order = await Order.create({ product_id, order_id, user_id: authUser.id, quantity, paid_Amount }, { transaction: trans })


        await Product.update({ quantity: isExistProductId.quantity - quantity }, { where: { id: isExistProductId.id }, transaction: trans })

        await trans.commit()
        return RESPONSE.success(res, 1401, order)
    } catch (error) {
        await trans.rollback();
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//........................get  all order by admin.............
const getAllOrderByAdmin = async (req, res) => {
    try {
        const authAdmin = req.user;

        const findOrder = await Order.findAll({
            where: { status: 'confirm' },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'description', 'product_categories_id', 'price', 'quantity',],
                    include: [
                        {
                            model: Product_images,
                            attributes: ['id', 'product_id', 'product_image']
                        }
                    ]
                },

            ]
        });

        if (!findOrder.length) {
            return RESPONSE.error(res, 1403)
        }

        return RESPONSE.success(res, 1402, findOrder)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//................get single order by admin.................
const getOneOrderByAdmin = async (req, res) => {
    try {
        const authAdmin = req.user;
        const order_id = req.query.order_id;

        const findOrder = await Order.findOne({
            where: { order_id: order_id, status: 'confirm' },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'description', 'product_categories_id', 'price', 'quantity',],
                    include: [
                        {
                            model: Product_images,
                            attributes: ['id', 'product_id', 'product_image']
                        }
                    ]
                },

            ]
        });

        if (!findOrder) {
            return RESPONSE.error(res, 1403)
        }

        return RESPONSE.success(res, 1402, findOrder)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//........................get order by user...................
const getOrderByUser = async (req, res) => {
    try {
        const authUser = req.user;

        const findOrder = await Order.findAll({
            where: { user_id: authUser.id, status: 'confirm' },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'description', 'product_categories_id', 'price', 'quantity'],
                    include: [
                        {
                            model: Product_images,
                            attributes: ['id', 'product_id', 'product_image']
                        }
                    ]
                }
            ]
        });
        if (!findOrder.length) {
            return RESPONSE.error(res, 1403)
        }

        return RESPONSE.success(res, 1402, findOrder)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//.....................get one order by user
const getOneOrderByUser = async (req, res) => {
    try {
        const authUser = req.user;
        const order_id = req.query.order_id;

        const findOrder = await Order.findOne({
            where: { order_id: order_id, user_id: authUser.id, status: 'confirm' },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'description', 'product_categories_id', 'price', 'quantity',],
                    include: [
                        {
                            model: Product_images,
                            attributes: ['id', 'product_id', 'product_image']
                        }
                    ]
                },

            ]
        });

        if (!findOrder) {
            return RESPONSE.error(res, 1403)
        }

        return RESPONSE.success(res, 1402, findOrder)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//..................order cancel.............
const cancelOrder = async (req, res) => {
    let validation = new Validator(req.body, {
        order_id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };

    try {
        const authUser = req.user;
        const { order_id } = req.body;

        const findOrder = await Order.findOne({ where: { order_id: order_id, status: 'confirm', user_id: authUser.id } });
        if (!findOrder) {
            return RESPONSE.error(res, 1403)
        }

        await Order.update({ status: 'cancel' }, { where: { order_id: order_id } });

        return RESPONSE.success(res, 1404)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//....................order carts product..............
const orderCartsProduct = async (req, res) => {
    let validation = new Validator(req.body, {
        products: 'required|array',//max:1 fix size in array
        'products.*.product_id': 'required',
        'products.*.quantity': 'required|numeric|min:1'
    },
        {
            "array.products": "allow only array"
        });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };

    let trans = await db.sequelize.transaction()
    try {
        const { products } = req.body;
        const authUser = req.user;

        const productArray = products.map((item) => item.product_id)
        console.log(productArray);
        const productData = new Set(productArray);
        console.log(productData);
        if (productData.size !== productArray.length) {
            return RESPONSE.error(res, 1405);
        }

        for (const cartData of products) {

            let order_id = randomstring.generate({
                length: 15,
                charset: 'alphanumeric'
            });

            let isExistOrderId = await Order.findOne({ where: { order_id } });

            while (isExistOrderId) {
                order_id = randomstring.generate({
                    length: 15,
                    charset: 'alphanumeric'
                });
                isExistOrderId = await Order.findOne({ where: { order_id } });
            }

            const CartProduct = await Cart.findOne({ where: { id: cartData.product_id } });
            if (!CartProduct) {
                return RESPONSE.error(res, 1309)
            }

            const isExistProductId = await Product.findOne({ where: { id: cartData.product_id } });
            if (!isExistProductId) {
                await trans.rollback()
                return RESPONSE.error(res, 1307)
            }

            if (isExistProductId.quantity < cartData.quantity) {
                await trans.rollback()
                return RESPONSE.error(res, 1308)
            }

            const paid_Amount = isExistProductId.price * cartData.quantity;

            const order = await Order.create({ product_id: cartData.product_id, order_id, user_id: authUser.id, quantity: cartData.quantity, paid_Amount }, { transaction: trans })

            await Product.update({ quantity: isExistProductId.quantity - cartData.quantity }, { where: { id: isExistProductId.id }, transaction: trans });

            await Cart.destroy({ where: { id: cartData.product_id }, transaction: trans })

        }

        await trans.commit();

        return RESPONSE.success(res, 1606)

    } catch (error) {
        await trans.rollback();
        console.log(error);
        return RESPONSE.error(res, 9999)
    }

}


module.exports = {
    order,
    getAllOrderByAdmin,
    getOneOrderByAdmin,
    getOrderByUser,
    cancelOrder,
    getOneOrderByUser,
    orderCartsProduct
}