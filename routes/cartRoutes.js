const express = require('express');
const { getUserCart, addToCart, removeFromCart, updateCart } = require('../controllers/cartController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const cartRoutes = express.Router();

cartRoutes.get('/get-Cart', isLoggedIn, getUserCart);
cartRoutes.post('/addToCart', isLoggedIn, addToCart);
cartRoutes.put('/updateCart/:id', isLoggedIn, updateCart);
cartRoutes.delete('/removeFromCart/:id', isLoggedIn, removeFromCart);

module.exports = cartRoutes