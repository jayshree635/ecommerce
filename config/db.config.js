const config = require('./config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(config.database.database, config.database.userName, config.database.password, {
    dialect: config.database.dialect,
    host: config.database.host,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

try {
    sequelize.authenticate();
    console.log("database connect successfully..");
} catch (error) {
    console.log(error);
}



let db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//....................models.................

db.User = require('../model/user/user.model')(sequelize,Sequelize);
db.UserSession = require('../model/user/userSession.model')(sequelize,Sequelize);

db.Admin = require('../model/admin/admin.model')(sequelize,Sequelize);
db.AdminSession = require('../model/admin/adminSession.model')(sequelize,Sequelize);

//......................relations......
db.User.hasMany(db.UserSession,{foreignKey : 'user_id'});
db.UserSession.belongsTo(db.User,{foreignKey : 'user_id'})

db.Admin.hasMany(db.AdminSession,{foreignKey : 'admin_id'});
db.AdminSession.belongsTo(db.Admin,{foreignKey : 'admin_id'})

db.sequelize.sync()
module.exports = db