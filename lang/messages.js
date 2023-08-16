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

    // Admin controller
    '1101': 'Get Admin profile successfully.',
    '1102': 'Login successfully!.',
    '1103': 'Admin not found.',
    '1104': 'update admin profile successfully',
    '1105': 'You are not admin',

    // categories controller
    '1201': 'Categories create successfully!',
    '1202': 'Categories data get successfully!',
    '1203': 'Categories delete successfully!',

    // product controller
    '1301': 'product create successfully!',
    '1302': 'product get successfully!',
    '1303': 'You are not admin!',
    '1304': 'product delete successfully',
    '1305': 'product uploded successfully',
    '1306': 'Please select video file..',
    '1307': 'Video not found',
    '1308': 'Video update successfully',
    '1309': 'You are not active admin!',

   

    //Attributes controller
    '1501': 'Create attributes successfully!',
    '1502': 'Get attributes successfully!',
    '1503': 'Get recently added videos successfully!',
    '1504': 'Get most viewed videos successfully!',
    '1505': 'Get most liked videos successfully!',
    '1506': 'Get trending videos successfully!',

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
