const moment = require('moment');
const fs = require('fs');
const db = require('../config/db.config');
const User = db.User;
const UserSession = db.UserSession;
const Admin = db.Admin;
const AdminSession = db.AdminSession;

//.....................user auth................
var authUser = async function (req, res, next) {
    const headerToken = req.headers.authorization ? req.headers.authorization : null;
    const isAuth = await UserSession.findOne({ where: { token: headerToken } });

    if (isAuth != null) {
        let userExist = await User.findOne({ where: { id: isAuth.user_id } });
        if (userExist) {
            req.user = userExist;
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized User.',
            });
        }

    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized Users.',
        });
    }
}


var authAdmin = async function (req, res, next) {
    const headerToken = req.headers.authorization ? req.headers.authorization : null;
    const isAuth = await AdminSession.findOne({ where: { token: headerToken } });

    if (isAuth != null) {
        let adminExist = await Admin.findOne({ where: { id: isAuth.admin_id } });
        if (adminExist) {
            req.user = adminExist;
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized User.',
            });
        }

    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized Users.',
        });
    }
}


module.exports = {
    authAdmin,
    authUser,
};
