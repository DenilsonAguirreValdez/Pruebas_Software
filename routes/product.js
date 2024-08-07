const express = require('express');
var multipart = require('connect-multiparty');

const productController = require('../controllers/productController');
const authetication = require('../middlewares/authenticate');

var path = multipart({uploadDir: './uploads/products'});
var path_ingreso = multipart({uploadDir: './uploads/facturas'});
var path_img = multipart({uploadDir: './uploads/gallery'});

const api = express.Router();

// Rutas de Productos
api.post('/register_product', [authetication.decodeToken, path], productController.register_product);
api.get('/get_products/:filter?', authetication.decodeToken, productController.get_products);
api.get('/get_all_products/', authetication.decodeToken, productController.get_all_products);
api.get('/get_frontPage_product/:img', productController.get_frontPage_product);
api.get('/get_product_id/:id',authetication.decodeToken, productController.get_product_id);
api.put('/update_product/:id',[authetication.decodeToken, path], productController.update_product);

// Rutas de variedades
api.post('/register_variety_product', authetication.decodeToken, productController.register_variety_product);
api.get('/get_variety_product/:id', authetication.decodeToken, productController.get_variety_product);
api.delete('/delete_variety_product/:id', authetication.decodeToken, productController.delete_variety_product);


// Rutas de ingresos
api.post('/register_income', [authetication.decodeToken, path_ingreso], productController.register_income);
api.get('/get_income_admin/:start/:end', authetication.decodeToken, productController.get_income_admin);
api.get('/get_frontPage_income/:name', productController.get_frontPage_income);
api.get('/get_income_details/:id', authetication.decodeToken, productController.get_income_details);

// Ruta para subir imagen
api.post('/register_imagen', [authetication.decodeToken, path_img], productController.register_imagen);
api.get('/get_gallery_product/:img', productController.get_gallery_product);
api.get('/list_image_gallery/:id', authetication.decodeToken, productController.list_image_gallery);
api.delete('/delete_image_gallery/:id', authetication.decodeToken, productController.delete_image_gallery);


// Rutas para categoria
api.post('/create_category', authetication.decodeToken, productController.create_category);
api.get('/list_category', authetication.decodeToken, productController.list_category);

// Rutas subcategorias
api.post('/create_subcategory', authetication.decodeToken, productController.create_subcategory);
api.delete('/delete_subcategory/:id', authetication.decodeToken, productController.delete_subcategory);
api.put('/change_status_to_product/:id', authetication.decodeToken, productController.change_status_to_product);

module.exports = api;
