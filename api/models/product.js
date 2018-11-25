const mongoose = require('mongoose');

const produtoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    productImage:{type: String, required: true}
});

module.exports = mongoose.model('Product', produtoSchema);