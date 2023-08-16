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
    },
    // logging : false
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

db.User = require('../model/user.model')(sequelize,Sequelize);
db.UserSession = require('../model/userSession.model')(sequelize,Sequelize);

db.Admin = require('../model/admin.model')(sequelize,Sequelize);
db.AdminSession = require('../model/adminSession.model')(sequelize,Sequelize);

db.Product_categories = require('../model/product_categories.model')(sequelize,Sequelize);
db.product = require('../model/product.model')(sequelize,Sequelize);
db.Product_images = require('../model/product_image.model')(sequelize,Sequelize);

//......................relations......
db.User.hasMany(db.UserSession,{foreignKey : 'user_id'});
db.UserSession.belongsTo(db.User,{foreignKey : 'user_id'})

db.Admin.hasMany(db.AdminSession,{foreignKey : 'admin_id'});
db.AdminSession.belongsTo(db.Admin,{foreignKey : 'admin_id'})

db.Product_categories.hasMany(db.product, {foreignKey : 'product_categories_id'})
db.product.belongsTo(db.Product_categories, {foreignKey : 'product_categories_id'})

db.product.hasMany(db.Product_images,{foreignKey : 'product_id'});
db.Product_images.hasMany(db.product,{foreignKey : 'product_id'});

// db.sequelize.sync({alert :true})
module.exports = db