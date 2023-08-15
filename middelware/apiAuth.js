const moment = require('moment');
const fs = require('fs');
const db = require('../config/db.config');
const User = db.user;
const UserSession = db.userSession;
const Admin = db.admin;
const AdminSession = db.adminSession;

var authUser = async function (req, res, next) {
    const headerToken = req.headers.authorization ? req.headers.authorization : null;
    const isAuth = await UserSession.findOne({ where: { token: headerToken } });

    if (isAuth != null) {
        if (isAuth.expire_timestamp + 360000 < moment().unix()) {
            await UserSession.destroy({ where: { token: headerToken } });
            return res.status(401).json({
                success: false,
                message: 'Session expired.',
            });
        } else {
            await UserSession.update({ expire_timestamp: moment().unix() }, { where: { token: headerToken } });
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
        }

    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized Users.',
        });
    }
}


module.exports = {
    authUser,
};
