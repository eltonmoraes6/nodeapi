const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const config = require('../config/config');

const ctrl = {};

ctrl.orders_get_all = async (req, res, next) => {
    await Order.find()
        .select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: config.webApiUrl + 'orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

ctrl.orders_create_order = async (req, res, next) => {
    await Product.findById(req.body.id)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                productID: req.body.id
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    productID: result.productID,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: config.webApiUrl + 'orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

ctrl.orders_get_order = async (req, res, next) => {
    await Order.findById(req.params.id)
        .populate('productID', 'name price')
        .exec()
        .then(order => {
            if (!order) {
                res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: config.webApiUrl + 'orders/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

ctrl.orders_remove_order = async (req, res, next) => {
    await Order.remove({
            _id: req.params.id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: config.webApiUrl + 'orders/',
                    body: {
                        id: 'ID',
                        quantity: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

module.exports = ctrl;