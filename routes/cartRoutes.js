const express = require('express');
const { getUserCart } = require('../controllers/cartController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const cartRoutes = express.Router();

cartRoutes.get('/get-Cart', isLoggedIn, getUserCart);

module.exports = cartRoutes