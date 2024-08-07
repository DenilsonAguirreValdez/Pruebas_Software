const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = Schema({
  title:  { type: String, required: true },
  slug:  { type: String, required: true },
  state:   { type: Boolean, default: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("category", CategorySchema);
