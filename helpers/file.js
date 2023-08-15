const uid = require('rand-token').uid;
const fs = require("fs");
const path = require('path');

function uploadFile(fileObjArray, pathFolder = 'image', fileFieldName = 'image') {
    const dir = './public/' + pathFolder
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    let profileImageName = null;
    if (this.isArrayDefine(fileObjArray)) {
        let fileObj = fileObjArray.find(file => file.fieldname == fileFieldName)
        if (!fileObj) {
            fileObj = fileObjArray[0]
        }
        profileImageName = uid(16) + path.extname(fileObj.originalname);
        const uploadPath = './public/' + pathFolder + '/' + profileImageName;
        const outStream = fs.createWriteStream(uploadPath);
        outStream.write(fileObj.buffer);
        outStream.end();
    }
    return profileImageName;
}

async function deleteFile(fileName, pathFolder = 'images') {
    try {
        const deletePath = './public/' + pathFolder + '/' + fileName;
        await fs.unlinkSync(deletePath);
        return true
    }
    catch (e) {
        return false
    }
}


function isFileFieldExist(fileObjArray, fileFieldName) {
    if (this.isArrayDefine(fileObjArray)) {
        return fileObjArray.some(file => file.fieldname == fileFieldName)
    }
    return false;
}

function isArrayDefine(fileObjArray) {
    if (typeof fileObjArray !== 'undefined' && fileObjArray.length > 0) {
        return true;
    }
    return false;
}

module.exports = {
    uploadFile,
    isFileFieldExist,
    isArrayDefine,
    deleteFile,
}