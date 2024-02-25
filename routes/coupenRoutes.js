const express = require('express');
const { createCoupon, getAllCoupons, getSingleCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const couponRoutes = express.Router();

couponRoutes.post('/create-coupon', isLoggedIn, createCoupon);
couponRoutes.get('/getAll', isLoggedIn, getAllCoupons);
couponRoutes.get('/:id', isLoggedIn, getSingleCoupon);
couponRoutes.put('/:id', isLoggedIn, updateCoupon);
couponRoutes.delete('/:id', isLoggedIn, deleteCoupon);


exports.default = couponRoutes