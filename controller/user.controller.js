const Validator = require('validatorjs');
const db = require('../config/db.config');
const bcrypt = require('bcryptjs')
const path = require('path')

//............models............
const User = db.User;
const UserSession = db.UserSession

//.........utils
const mailUtils = require('../utils/sendMail')

//...........phone_no validation
Validator.register('phone_length', (value) => {
    return value.length >= 10 && value.length <= 12;
}, 'The phone_no must be between 10 and 12 characters.');


//.....................signUp api..............
const signUp = async (req, res) => {
    let validation = new Validator(req.body, {
        name: 'required|string|max:50',
        email: 'required|max:50',
        password: 'required|min:6|max:15',
        phone_no: 'required|numeric|phone_length'
    });

    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }

    try {
        const { name, email, password, phone_no } = req.body;
        const profile_image = req?.file?.filename;
        const otp = Math.floor(100000 + Math.random() * 9000);

        const currentTime = Date.now();
        const expirationMinutes = 120;
        const opt_time = new Date(currentTime + expirationMinutes * 60 * 1000);

        const existUser = await User.findOne({ where: { email: email } });

        if (existUser) {
            if (existUser.isVerify == 1) {
                return RESPONSE.error(res, "user account exist")
            };
            await existUser.update({ otp });
        } else {
            const userData = await User.create({ name, email, phone_no, password, profile_image, otp, opt_time });

        }

        const mail = mailUtils.sendMail("otp mail", `verify email otp  : ${otp}`);
        return RESPONSE.success(res, 1017)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//.........................email verify ..............................
const emailVerify = async (req, res) => {
    let validation = new Validator(req.body, {
        email: 'required',
        otp: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };
    try {
        const { email, otp } = req.body;
        const currentTime = Date.now();
        const isExist = await User.findOne({ where: { email: email } })
        if (!isExist) {
            return RESPONSE.success(res, 1016)
        }

        if (isExist.isVerify == 1) {
            return RESPONSE.error(res, 1012)
        }

        if (isExist.otp != otp) {
            return RESPONSE.error(res, 1013)
        }

        if (currentTime >= isExist.opt_time) {
            return RESPONSE.error(res, 1015)
        }


        await isExist.update({ isVerify: true })

        return RESPONSE.success(res, 1014)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }

}


//....................login user.............................
const login = async (req, res) => {
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

        const isExist = await User.scope('withPassword').findOne({ where: { email: email ,isVerify : true} });
        if (isExist) {
            if (await User.comparePassword(password, isExist.password)) {
                const userJson = isExist.toJSON();
                userJson.token = await UserSession.createToken(userJson.id);
                delete userJson.password;
                return RESPONSE.success(res, 1002, userJson);
            } else {
                return RESPONSE.error(res, 1010)
            }
        } else {
            return RESPONSE.error(res, 1008);
        }

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }

}

//..........................get user profile........................
const getUserProfile = async (req, res) => {
    try {
        const authUser = req.user;

        // const findUser = await User.scope('withPassword').findOne({ where: { id: userId, } });
        const findUser = await User.findOne({ id: authUser.id, deleted_At: null }, '-password')

        if (!findUser) {
            return RESPONSE.error(res, 1008)
        }

        delete findUser.password

        return RESPONSE.success(res, 1004, findUser)

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}



//...................update profile......................
const updateProfile = async (req, res) => {


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
        const authUser = req.user;

        const { name, current_password, new_password, phone_no } = req.body;
        const profile_image = req?.file?.filename;

        const object = {
            name,
            phone_no
        }
        const findUser = await User.scope('withPassword').findOne({ where: { id: authUser.id } });

        if (new_password) {
            if (!await User.comparePassword(current_password, findUser.password)) {
                return RESPONSE.error(res, 1009);
            }
            object.password = new_password;
        };

        if (profile_image) {
            // Delete old image if exists
            if (findUser.profile_image) {
                await FILEACTION.deleteFile(path.basename(findUser.profile_image), 'images/profileImages');
            }
            object.profile_image = profile_image;
        }

        const userData = await User.update(object, { where: { id: authUser.id } });
        return RESPONSE.success(res, 1005, userData);

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//..............................logout user....................
const logout = async (req, res) => {
    try {
        const authUser = req.user;

        await UserSession.destroy({ where: { token: req.headers.authorization } });

        return RESPONSE.success(res, 1003)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}
//..............delete user.............
const deleteUser = async (req, res) => {
    try {
        const authUser = req.user;

        const findUser = await User.findOne({ where: { id: authUser.id } });
        if (!findUser) {
            return RESPONSE.error(res, 1008);
        }

        await findUser.destroy();
        await UserSession.destroy({ where: { user_id: findUser.id } });


        return RESPONSE.success(res, 1006);
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999);
    }
}


module.exports = {
    signUp,
    emailVerify,
    login,
    getUserProfile,
    updateProfile,
    logout,
    deleteUser
}