const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesDeatailSchema = Schema({
  year:         { type: Number, required: true },
  month:        { type: Number, required: true },
  day:          { type: Number, required: true },
  subtotal:     { type: String, required: true },
  price_unit:   { type: Number, required: true },
  amount:       { type: Number, required: true },
  sales:        { type: Schema.ObjectId, ref: 'sale', required: true },
  customer:     { type: Schema.ObjectId, ref: 'customer', required: true },
  product:      { type: Schema.ObjectId, ref: "product", required: true },
  variety:      { type: Schema.ObjectId, ref: "variety", required: true },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model("sales_detail", SalesDeatailSchema);