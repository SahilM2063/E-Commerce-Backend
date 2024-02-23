const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const orderRouter = express.Router();

orderRouter.post('/create-order', isLoggedIn, createOrder);

exports.default = orderRouter;