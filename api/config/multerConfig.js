const multer = require('multer');
const ctrl = {};

ctrl.MY_UPLOAD_STORAGE = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
                cb(null, true);
            } else {
                cb(null, false);
            }
        }
    }),
    ctrl.MY_UPLOAD_STORAGE_MULTER = multer({
        storage: ctrl.MY_UPLOAD_STORAGE
    }),

module.exports = ctrl;