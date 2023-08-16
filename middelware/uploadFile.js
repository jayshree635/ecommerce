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

function uploadMultipleImage(folderName, fileName) {
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
      limits: {
        fileSize: 5 * 1024 * 1024, // 5mb file size
        files: 5
      }
    }).array(fileName);
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(404).json({
            success: false,
            message: "you can upload a maximum 5mb per file."
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(404).json({
            success: false,
            message: "you can upload a maximum 5 file."
          });
        }

      } else if (err) {
        return res.status(404).send(err.message);
      }
      next();
    });
  }
};

//............
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
  uploadImage,
  uploadMultipleImage
};