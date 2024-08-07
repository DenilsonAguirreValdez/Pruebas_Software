const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    title:          { type: String, required: true },
    slug:           { type: String, required: true },
    category:       { type: String, required: true },
    subcategory:    { type: String, required: false },
    stock:          { type: Number, default: 0, required: true },
    price:          { type: Number, default: 0, required: true },
    variety:        { type: String, required: true },
    description:    { type: String, required: true },
    state:          { type: String, required: true },
    frontPage:      { type: String, required: true },
    discount:       { type: Boolean, required: true },
    updateAt:       { type: Date, required: false },
    createdAt:      { type: Date, default: Date.now },
});

module.exports = mongoose.model("product", ProductSchema);
