const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = Schema({
    start:      {type: Number, required: true},
    comment:    {type: String, required: true},
    product:    {type: Schema.ObjectId, ref: 'product', require: true},
    customer:   {type: Schema.ObjectId, ref: 'customer', require: true},
    createdAt:  {type: Date, default: Date.now}
});

module.exports = mongoose.model('review', ReviewSchema);