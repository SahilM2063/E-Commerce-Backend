const express = require('express');
const { getUserCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const cartRoutes = express.Router();

cartRoutes.get('/get-Cart', isLoggedIn, getUserCart);
cartRoutes.post('/addToCart', isLoggedIn, addToCart);
cartRoutes.delete('/removeFromCart', isLoggedIn, removeFromCart);

module.exports = cartRoutes