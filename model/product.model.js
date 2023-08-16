
module.exports = (sequelize,Sequelize) =>{
    const product = sequelize.define('products',{
        id : {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        title : {
            type: Sequelize.STRING,
            allowNull : false
        },
        description : {
            type: Sequelize.STRING,
            allowNull : false
        },
        product_categories_id:{
            type : Sequelize.BIGINT.UNSIGNED,
            references : {
                model : 'product_categories',
                key : 'id'
            }
        },
        price : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        quantity : {
            type : Sequelize.INTEGER,
            allowNull : false
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
        // product_image :{
        //     get() {
        //         const rawValue = this.getDataValue('product_image');
        //         return rawValue ? ASSETS.getProfileURL(rawValue,"productImages") : null;
        //     }
        // }
    },{
        tableName : 'products',
        paranoid : true
    })
    return product
}