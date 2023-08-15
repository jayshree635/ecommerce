module.exports = (sequelize,Sequelize)=>{
    const adminSession = sequelize.define('adminSessions',{
        admin_id : {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'admins',
                key: 'id'
            }
        },
        token : {
            type : Sequelize.STRING(255)
        },
        createdAt : {
            field : 'created_at',
            type: Sequelize.DATE,
            allowNull: true,
        },
        updatedAt : {
            field : 'updated_at',
            type: Sequelize.DATE,
            allowNull: true,
        },
        deletedAt : {
            field : 'deleted_at',
            type: Sequelize.DATE,
            allowNull: true,
        }
    },{
        tableName : 'adminSessions',

    });
    adminSession.createToken = async function (adminId) {
        var AdminSession = await AdminSession.create({
            token: adminId + suid(99),
            admin_id: adminId,
        });
        return AdminSession.token;
    };

    return adminSession
}