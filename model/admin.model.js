const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
    const admin = sequelize.define('admins', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('password', bcrypt.hashSync(value, 10));
            }
        },
        phone_no: {
            type: Sequelize.STRING,
            allowNull: false
        },
        profile_image: {
            type: Sequelize.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('profile_image');
                return rawValue ? ASSETS.getProfileURL(rawValue, "profileImages") : null;
            }
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
            allowNull: true,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
            allowNull: true,
        },
        deletedAt: {
            field: 'deleted_at',
            type: Sequelize.DATE,
            allowNull: true,
        }
    }, {
        tableName: 'admins',
        paranoid: true,

        defaultScope: {
            attributes: { exclude: ['deletedAt', 'password'] }
        },

        scopes: {
            withPassword: {
                attributes: { exclude: ['deletedAt'] }
            }
        }
    });

    admin.comparePassword = (painText, hash) => bcrypt.compareSync(painText, hash)

    admin.isExistField = async (whereClause) => {
        return await User.findOne({ where: whereClause })
    };

    return admin
}