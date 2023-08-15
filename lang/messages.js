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
    '1011':'user account already exist',
    '1012': 'email is verifyed',
    '1013' : 'send again mail',
    '1014' : 'email verify successfully...',
    '1015' : 'otp time expire Send mail again',
    '1016' : 'email not exist',
    '1017' : 'check your mail',

    // categories controller
    '1101': 'Categories create successfully!',
    '1102': 'Categories data get successfully!',
    '1103': 'Categories delete successfully!',
  
    // sub categories controller
    '1201': 'SubCategories create successfully!',
    '1202': 'SubCategories data get successfully!',
    '1203': 'SubCategories delete successfully!',
  
    // video controller
    '1301': 'Video create successfully!',
    '1302': 'Video get successfully!',
    '1303': 'You are not admin!',
    '1304': 'Video delete successfully',
    '1305': 'Video uploded successfully',
    '1306': 'Please select video file..',
    '1307': 'Video not found',
    '1308': 'Video update successfully',
    '1309': 'You are not active admin!',

    //super admin controller
    '1401': 'Get all admins successfully!',
    '1402': 'You are not super admin!',
    '1403': 'Get admin successfully!',
    
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
