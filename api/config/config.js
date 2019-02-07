const dotenv = require('dotenv').config();

if (dotenv.error) {
    throw dotenv.error
}
//console.log(dotenv);

const ctrl = {};

ctrl.secret = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

if (process.env.NODE_ENV === 'production') {
    ctrl.dbURI = process.env.MONGOLAB_URI;
    ctrl.webApiUrl = process.env.WEB_API_URL
} else {
    ctrl.dbURI = 'mongodb://localhost:27017/node-api';
    ctrl.webApiUrl = 'http://localhost:3000/api/';
};

module.exports = ctrl;