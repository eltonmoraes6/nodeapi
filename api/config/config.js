const mongoose = require('mongoose');
const multer = require('multer');

module.exports = {
    'secret': 'supersecret',
    'productsApiUri':'http://localhost:3000/products/',
    'ordersApiUri':'http://localhost:3000/orders/',
    'userApiUri':'http://localhost:3000/user/',
    MY_CONNECTION_URI: uri = 'mongodb://localhost:27017/node-api',
    MY_CONNECTION: connectWithRetry = function () {
        mongoose.connect(uri, {
            useCreateIndex: true,
            useNewUrlParser: true
        }).then(function () {
            console.log('Successfully connected to MongoDB');
        }).catch(function (err) {
            if (err) {
                console.log('Failed to connect to mongo on startup - retrying in 5 sec', err);
                setTimeout(connectWithRetry, 5000);
            }
        });
    },
    //avatar upload img 
    MY_UPLOAD_STORAGE: storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/');
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
    MY_UPLOAD_STORAGE_MULTER: upload = multer({
        storage: storage
    })
};