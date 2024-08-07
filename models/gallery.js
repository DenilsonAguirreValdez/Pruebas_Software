const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GallerySchema = Schema({
  imagen:  { type: String, required: true },
  product:   { type: Schema.ObjectId, ref: "product", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("gallery", GallerySchema);
