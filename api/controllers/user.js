const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
var fs = require("fs");

exports.user_signup = async (req, res, next) => {
    await User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email aready exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                            .then(result => {
                                //console.log(result);
                                res.status(201).json({
                                    message: 'user created successfully',
                                    data: {
                                        email: result.email,
                                        id: result._id,
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:3000/user/' + result._id
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }

                });
            }
        });
}

exports.user_signin = async (req, res, next) => {
    await User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user,
                        id: user._id
                    }, config.secret, {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        auth: true,
                        message: 'Auth successful',
                        token: token,
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_find_one = async (req, res, next) => {
    await User.findById({
            _id: req.params.id
        })
        .select('email _id')
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    data: result,
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_user_avatar = (req, res, next) => {
    if (req.file) {
        var newAvatar = new Buffer(fs.readFileSync(req.file.path)).toString("base64");

        const email = req.userData.email.email;
        //console.log(email);
        User.updateOne({
                email: email
            }, {
                $set: {
                    avatar: newAvatar,
                }
            })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'User Avatar updated',
                    result,
                });
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            });

        fs.unlink(req.file.path, function (err) {
            if (err) {
                throw err;
            } else {
                console.log('File unlinked');
            }
        });
    } else {
        res.status(404).json({
            message: 'No file provided'
        });
    }
}

exports.user_remove = async (req, res, next) => {
    await User.remove({
            _id: req.params.id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted successfully'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}