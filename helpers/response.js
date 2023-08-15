const messages = require('../lang/messages.js');
module.exports.success = function (res, messageCode = null, data = null) {
    var response = {};
    response.success = true;
    response.message = messages.getMessage(messageCode);
    response.data = data;
    return res.send(response);
};

module.exports.error = function (res, messageCode, error = '', statusCode = 422) {
    var response = {};
    response.success = false;
    response.message = messages.getMessage(messageCode);
    if(error != ''){
        response.error = error;
    }
    statusCode = (messageCode == 9999) ? 500 : statusCode;
    return res.status(statusCode).send(response)
};
