const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = Schema({
    supplier:           {type: String, required: true},
    nvoucher:           {type: String, required: true},
    document:           {type: String, required: true},
    total_amount:       {type: String, required: true},
    series:             {type: Number, required: false},
    resulting_amount:   {type: String, required: true},
    user:               {type: Schema.ObjectId, ref: 'user', require: true},
    createdAt:          {type: Date, default: Date.now}
});

module.exports = mongoose.model('income', IncomeSchema);