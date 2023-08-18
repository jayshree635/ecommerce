require('dotenv').config();

//...........config file.......
module.exports = {
    app_project_path: process.env.APP_PROJECT_PATH,
    prot: process.env.PORT,
    protocol: process.env.PROTOCOL,

    database: {
        database: process.env.DB_DATABASE,
        userName: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST
    },

    email: {
        email: process.env.EMAIL,
        pass: process.env.PASS
    },
    sslCertificates: {
        privkey: process.env.PRIVKEY,
        fullchain: process.env.FULLCHAIN
    }
}