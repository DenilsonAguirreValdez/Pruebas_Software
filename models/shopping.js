const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingSchema = Schema({
    product:            {type: Schema.ObjectId, ref: 'product', require: true},
    variety:            {type: Schema.ObjectId, ref: 'variety', require: true},
    amount:             {type: Number, required: true},
    customer:           {type: Schema.ObjectId, ref: 'customer', require: true},
    createdAt:          {type: Date, default: Date.now}
});

module.exports = mongoose.model('shopping', ShoppingSchema);