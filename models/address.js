const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddresSchema = Schema({
  name:         { type: String, required: true },
  lastName:     { type: String, required: true },
  idDocument:   { type: String, required: true },
  phone:        { type: String, required: true },
  country:      { type: String, required: true },
  city:         { type: String, required: true },
  code:         { type: String, required: true },
  address:      { type: String, required: true },
  customer:     { type: Schema.ObjectId, ref: 'customer', required: true },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model("addres", AddresSchema);