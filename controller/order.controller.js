const Validator = require('validatorjs');
const db = require('../config/db.config');
const randomstring = require('randomstring');

//...........models..........
const Order = db.Order;
const User = db.User;
const Product = db.product


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



module.exports = {
    order
}