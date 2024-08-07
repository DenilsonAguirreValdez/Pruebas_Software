const express = require('express');
const customerController = require('../controllers/customerController');

const api = express.Router();

api.post('/register_user_ecomerce', customerController.register_user_ecomerce);
api.post('/login_users_ecomerce', customerController.login_users_ecomerce);

module.exports = api;
