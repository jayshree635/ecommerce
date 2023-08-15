const path = require('path');
const multer = require('multer');


function uploadFile(fileName) {
  return async (req, res, next) => {
    var upload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `public/videos`)
        },

        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
      }),
    }).single(fileName);
    upload(req, res, (err) => {
      if (err) {
        return res.status(404).send(err.message);
      }
      next();
    });
  }
};

function uploadImage(folderName, fileName) {
  return async (req, res, next) => {
    var upload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `public/images/${folderName}`)
        },

        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
      }),

      fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      },
    }).single(fileName);
    upload(req, res, (err) => {
      if (err) {
        return res.status(404).send(err.message);
      }
      next();
    });
  }
};

module.exports = {
  uploadFile,
  uploadImage
};