const express = require('express');
const { createReview } = require('../controllers/reviewController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');


const reviewRoutes = express.Router();

reviewRoutes.post('/:product_id', isLoggedIn, createReview);

exports.default = reviewRoutes;