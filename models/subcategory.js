const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubcategorySchema = Schema({
  title:  { type: String, required: true },
  category:   { type: Schema.ObjectId, ref: "category", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("subcategory", SubcategorySchema);
