
module.exports = (sequelize, Sequelize) => {
    const product_image = sequelize.define('product_images', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        product_image: {
            type: Sequelize.TEXT,
            get() {
                const rawValue = this.getDataValue('product_image');
                return rawValue ? ASSETS.getProfileURL(rawValue, "productImages") : null;
            }
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
        tableName: 'product_images',
        paranoid: true
    })
    return product_image
}