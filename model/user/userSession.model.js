var suid = require('rand-token').suid;

module.exports = (sequelize, Sequelize) => {
    const UserSession = sequelize.define('user_sessions', {
        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        token: {
            type: Sequelize.STRING(500),
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'user_sessions',
    });

    UserSession.createToken = async function (userId) {
        var userSession = await UserSession.create({
            token: userId + suid(99),
            user_id: userId,
        });
        return userSession.token;
    };

    UserSession.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        values.created_at = values.created_at;
        values.updated_at = values.updated_at;
        ['created_at', 'updated_at'].forEach(e => delete values[e]);
        return values;
    };
    return UserSession;
}

