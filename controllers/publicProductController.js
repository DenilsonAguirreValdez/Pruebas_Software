const Product = require("../models/products");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Varieties = require('../models/variety');
const Gallery = require('../models/gallery');

const get_new_product = async (req, res) => {
  const product = await Product.find({ state: true })
    .sort({ createdAt: -1 })
    .limit(4);
  res.status(200).send(product);
};

const get_product_recommended = async (req, res) => {
    const product = await Product.find({ state: true }).limit(8);
    res.status(200).send(product);
};

const get_product_shop = async (req, res) => {
    var data_products = [];
    const product = await Product.find({ state: true }).sort({ createdAt: -1 });
    for(var item of product){

        var varieties = await Varieties.find({product: item._id});
        data_products.push({
            title:          item.title,
            slug:           item.slug,
            category:       item.category,
            subcategory:    item.subcategory,
            price:          item.price,
            variety:        item.variety,
            description:    item.description,
            state:          item.state,
            frontPage:      item.frontPage,
            discount:       item.discount,
            createdAt:      item.createdAt,
            varieties
        })
    }
    res.status(200).send(data_products);
    console.log(product);
};

// Listar categorias
const list_category_product = async (req, res) => {
  var regs = await Category.find({state: true}).sort({ title: 1 });
  var categories = [];

  for (var item of regs) {
    var subcategory = await Subcategory.find({ category: item._id });
    var products = await Product.find({ category: item.title });

    categories.push({
      category: item,
      subcategory,
      nproducts: products.length,
    });
  }
  res.status(200).send(categories);
};

const get_product_slug = async (req, res) => {
  const slug = req.params['slug'];

  const product = await Product.findOne({slug:slug});
  const varieties = await Varieties.find({product:product._id});
  const gallery = await Gallery.find({product:product._id});

  res.status(200).send({product, varieties, gallery});
  console.log(product);
  console.log(varieties);
  console.log(gallery);
};

const get_product_category = async (req, res) => {
  const category = req.params['category'];

  const product = await Product.find({category:category}).limit(6);
  
  res.status(200).send({product});
  console.log(product);
};

module.exports = {
  get_new_product,
  get_product_recommended,
  get_product_shop,
  list_category_product,
  get_product_slug,
  get_product_category 
};
