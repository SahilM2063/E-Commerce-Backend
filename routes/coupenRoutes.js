const express = require('express');
const { createCoupon, getAllCoupons, getSingleCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');

const couponRoutes = express.Router();

couponRoutes.post('/create-coupon', isLoggedIn, isAdmin, createCoupon);
couponRoutes.get('/getAll', getAllCoupons);
couponRoutes.get('/:id', getSingleCoupon);
couponRoutes.put('/:id', isLoggedIn, isAdmin, updateCoupon);
couponRoutes.delete('/:id', isLoggedIn, isAdmin, deleteCoupon);


module.exports = couponRoutes