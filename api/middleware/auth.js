const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.ensureAuthorized = function (req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if (token) {
        //verify token
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Token invalid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json({
            success: false,
            message: 'No token provided'
        });
    }
}