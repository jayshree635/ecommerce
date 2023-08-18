const Validator = require('validatorjs');
const db = require('../config/db.config');
const path = require('path')

//....models
const Admin = db.Admin;
const AdminSession = db.AdminSession;

//...........phone_no validation
Validator.register('phone_length', (value) => {
    return value.length >= 10 && value.length <= 12;
}, 'The phone_no must be between 10 and 12 characters.');


//.......................login admin........................
const adminLogin = async (req, res) => {
    let validation = new Validator(req.body, {
        email: 'required',
        password: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };
    try {
        const { email, password } = req.body;

        const isExist = await Admin.scope('withPassword').findOne({ where: { email: email } });

        if (isExist) {
            if (await Admin.comparePassword(password, isExist.password)) {
                console.log("ok1");
                const adminJson = isExist.toJSON();
                adminJson.token = await AdminSession.createToken(isExist.id);
                delete adminJson.password;
                return RESPONSE.success(res, 1102, adminJson);
            } else {
                console.log("ok2");

                return RESPONSE.error(res, 1010)
            }
        } else {
            return RESPONSE.error(res, 1103);
        }

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }

}

//........................get Admin  profile.......................
const getAdminProfile = async (req, res) => {
    try {
        const authAdmin = req.user;

        const findUser = await Admin.findOne({ id: authAdmin.id, deleted_At: null }, '-password')

        if (!findUser) {
            return RESPONSE.error(res, 1103)
        }

        delete findUser.password

        return RESPONSE.success(res, 1101, findUser)

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//.....................update admin profile...................
const updateAdminProfile = async (req, res) => {


    let validation = new Validator(req.body, {
        name: 'string|max:50',
        current_password: 'required_with:new_password|min:6|max:15',
        new_password: 'min:6|max:15',
        phone_no: 'required|numeric|phone_length'
    });

    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const authAdmin = req.user;

        const { name, current_password, new_password, phone_no } = req.body;
        const profile_image = req?.file?.filename;

        const object = {
            name,
            phone_no
        }
        const findAdmin = await Admin.scope('withPassword').findOne({ where: { id: authAdmin.id } });
        if (new_password) {
            if (!await Admin.comparePassword(current_password, findAdmin.password)) {
                return RESPONSE.error(res, 1009);
            }
            object.password = new_password;
        };

        if (profile_image) {
            // Delete old image if exists
            if (findAdmin.profile_image) {
                await FILEACTION.deleteFile(path.basename(findAdmin.profile_image), 'images/profileImages');
            }
            object.profile_image = profile_image;
        }

        const adminData = await Admin.update(object, { where: { id: authAdmin.id } });
        return RESPONSE.success(res, 1104, adminData);

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//........................logout admin.......................
const AdminLogout = async (req, res) => {
    try {
        const authAdmin = req.user;

        await AdminSession.destroy({ where: { token: req.headers.authorization } });

        return RESPONSE.success(res, 1003)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}
module.exports = {
    getAdminProfile,
    adminLogin,
    updateAdminProfile,
    AdminLogout
}