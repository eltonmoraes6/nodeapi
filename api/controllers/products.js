const mongoose = require('mongoose');
const Product = require('../models/product');
const config = require('../config/config');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const respose = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: config.productsApiUri + doc._id
                        }
                    }
                })
            }
            if (docs.length >= 0) {
                res.status(200).json(respose);
            } else {
                res.status(404).json({
                    message: 'No entries found'
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully   ',
            createdProduct: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: config.productsApiUri + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

}

exports.products_get_product = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: config.productsApiUri
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }

        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: config.productsApiUri
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.products_remove_product = (req, res, next) => {
    const id = req.params.id;
    Product.remove({
        _id: id
    }).exec().then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: config.productsApiUri,
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}