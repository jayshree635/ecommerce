const MESSAGES = {
    // user controller
    '1001': 'Signup successfully!',
    '1002': 'Login successfully!',
    '1003': 'Logout successfully!',
    '1004': 'Get user profile successfully.',
    '1005': 'Upadate user profile successfully.',
    '1006': 'User Account deleted successfully.',
    '1007': 'Email already exist.',
    '1008': 'User not found.',
    '1009': 'Password does not match.',
    '1010': 'Email or password are not match.',
    '1011': 'user account already exist',
    '1012': 'email is verifyed',
    '1013': 'send again mail',
    '1014': 'email verify successfully...',
    '1015': 'otp time expire Send mail again',
    '1016': 'email not exist',
    '1017': 'check your mail',
    '1018': 'check your mail',

    // Admin controller
    '1101': 'Get Admin profile successfully.',
    '1102': 'Login successfully!.',
    '1103': 'Admin not found.',
    '1104': 'update admin profile successfully',
    '1105': 'You are not admin',

    // product categories controller
    '1201': 'product Categories create successfully!',
    '1202': 'product Categories  get successfully!',
    '1203': 'product Categories delete successfully!',
    '1204': 'product Categories not found!',
    '1205': 'product Categories update successfully!',
    '1205': 'product Categories delete successfully!',


    // product controller
    '1301': 'product create successfully!',
    '1302': 'product get successfully!',
    '1303': 'You are not admin!',
    '1304': 'product delete successfully',
    '1305': 'product update successfully',
    '1306': 'Please select video file..',
    '1307': 'product not found',
    '1308': 'product quantity not available',



    // order controller
    '1401' : 'order create successfully',
    '1402' : 'order get successfully',

    //video track controller
    '1601': 'Create like successfully!',
    '1602': 'Dislike video successfully!',
    '1603': 'Create views successfully!',
    '1604': 'Total likes of video is Zero!',

    // sub categories controller
    '1701': 'Sub categories create successfully!',
    '1702': 'Sub Categories data get successfully!',
    '1703': 'Sub Categories not found!',

    // Common
    '9000': 'Please Enter valid Details',
    '9999': "Something went wrong!",
}

module.exports.getMessage = function (messageCode) {
    if (isNaN(messageCode)) {
        return messageCode;
    }
    return messageCode ? MESSAGES[messageCode] : '';
};
