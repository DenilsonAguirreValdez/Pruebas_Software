const express = require('express');
const customerController = require('../controllers/customerControllerEcomerce');
const cauthenticate = require('../middlewares/cauthenticate');

const api = express.Router();

api.post('/create_product_car', cauthenticate.decodeToken, customerController.create_product_car);
api.get('/get_product_car', cauthenticate.decodeToken, customerController.get_product_car);
api.delete('/delete_product_car/:id', cauthenticate.decodeToken, customerController.delete_product_car);


api.post('/create_addres_customer', cauthenticate.decodeToken, customerController.create_addres_customer);
api.get('/get_addres_customer', cauthenticate.decodeToken, customerController.get_addres_customer);
api.delete('/delete_addres_customer/:id', cauthenticate.decodeToken, customerController.delete_addres_customer);

module.exports = api;