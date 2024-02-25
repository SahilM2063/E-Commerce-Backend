const express = require('express');
const { createOrder, getAllOrders, getSingleOrder, updateOrder, getOrderStats } = require('../controllers/orderController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const orderRouter = express.Router();

orderRouter.post('/create-order', isLoggedIn, createOrder);
orderRouter.get('/getAll', isLoggedIn, getAllOrders);
orderRouter.get('/:id', isLoggedIn, getSingleOrder);
orderRouter.put('/update/:id', isLoggedIn, updateOrder);
orderRouter.get('/sales/stats', isLoggedIn, getOrderStats);


exports.default = orderRouter;