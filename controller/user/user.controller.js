const Validator = require('validatorjs');
const db = require('../../config/db.config');

//............models............
const User = db.User;
const UserSession = db.UserSession


//.........utils
const mailUtils = require('../../utils/sendMail')

const signUp = async (req, res) => {
    let validation = new Validator(req.body, {
        name: 'required|string|max:50',
        email: 'required|max:50',
        password: 'required|min:6|max:15',
        phone_no: 'required|min:10|max:12',
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
          const userData=  await User.create({ name, email, phone_no, password, profile_image, otp, opt_time });
            
        }

        // const mail = mailUtils.sendMail("otp mail", `verify email otp  : ${otp}`);
        return RESPONSE.success(res, 1017)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

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
            return RESPONSE.error(res,1013 )
        }
       
       if (currentTime >=isExist.opt_time) {
          return RESPONSE.error(res,1015)
        }

       
        await isExist.update({ isVerify: true })

        return RESPONSE.success(res, 1014)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }

}


const login = async(req,res) =>{
    let validation = new Validator(req.body,{
        
    })
}



module.exports = {
    signUp,
    emailVerify
}