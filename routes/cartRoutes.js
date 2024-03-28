const express = require('express');
const { getUserCart, addToCart } = require('../controllers/cartController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const cartRoutes = express.Router();

cartRoutes.get('/get-Cart', isLoggedIn, getUserCart);
cartRoutes.post('/addToCart', isLoggedIn, addToCart);

module.exports = cartRoutes