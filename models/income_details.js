const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const income_detailsSchema = Schema({
    amount:     {type: Number, required: true},
    unit_price: {type: Number, required: true},
    income:     {type: Schema.ObjectId, ref: 'income', require: true},
    product:    {type: Schema.ObjectId, ref: 'product', require: true},
    variety:    {type: Schema.ObjectId, ref: 'variety', require: true},
    createdAt:  {type: Date, default: Date.now}
});

module.exports = mongoose.model('income_details', income_detailsSchema);