const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesSchema = Schema({
  transaction:  { type: String, required: true },
  year:         { type: Number, required: true },
  month:        { type: Number, required: true },
  day:          { type: Number, required: true },
  serie:        { type: Number, required: true },
  total:        { type: Number, required: true },
  sending:      { type: Number, required: true },
  state:        { type: String, required: true },
  customer:     { type: Schema.ObjectId, ref: "customer", required: true },
  addres:       { type: Schema.ObjectId, ref: "addres", required: true },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model("sale", SalesSchema);
