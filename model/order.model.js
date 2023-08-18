module.exports = (sequelize, Sequelize) => {
    const order = sequelize.define('orders', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        product_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        paid_Amount: {
            type: Sequelize.INTEGER,
            // allowNull : false
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM(['cancel', 'confirm']),
            defaultValue: 'confirm'
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
            allowNull: false
        },
        deletedAt: {
            field: 'deleted_at',
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        tableName: 'orders',
        paranoid: true
    })
    return order
}
