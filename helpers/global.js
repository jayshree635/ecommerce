const Object = require('../config/db.config.js');

// Provide sucess and error related response method 
if (!global.RESPONSE)
    global.RESPONSE = require('./response.js');


//....assets url function
if (!global.ASSETS) {
    global.ASSETS = require('./assets.js');
}

//.....file related function
if (!global.FILEACTION) {
    global.FILEACTION = require('./file.js')
}