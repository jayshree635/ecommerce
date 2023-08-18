require('dotenv').config();

function getProfileURL(fileName, folderName) {
    return process.env.APP_PROJECT_PATH + `images/${folderName}/` + fileName;
}
function getFileURL(fileName) {
    return process.env.APP_PROJECT_PATH + `videos/` + fileName;
}


module.exports = {
    getProfileURL,
    getFileURL
};
