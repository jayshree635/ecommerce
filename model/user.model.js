
const bcrypt = require('bcryptjs')

module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('users', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            // allowNull : false
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
                return rawValue ? ASSETS.getProfileURL(rawValue,"profileImages") : null;
            }
        },
        otp : {
             type : Sequelize.INTEGER,

        },
        opt_time : {
            type : Sequelize.DATE,
        },
        isVerify : {
           type : Sequelize.BOOLEAN,
           defaultValue :false
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
        tableName: 'users',
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

    user.comparePassword = (painText, hash) => bcrypt.compareSync(painText, hash)

    user.isExistField = async (whereClause) => {
        return await User.findOne({ where: whereClause })
    };


    return user
}