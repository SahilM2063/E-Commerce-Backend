const Product = require('../models/Product');
const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');

const createReview = asyncHandler(async (req, res) => {
    const { product_id } = req.params
    const { rating, comment } = req.body

    const productFound = await Product.findById(product_id).populate('reviews');
    // check if product exists
    if (!productFound) {
        throw new Error('Product not found')
    }

    // check if review already exists
    const isReviewed = await productFound?.reviews?.find((review) => {
        return review?.user?.toString() === req?.userAuthId?.toString()
    })
    if (isReviewed) {
        throw new Error('You have already reviewed this product')
    }

    // create review
    const review = await Review.create({
        product: productFound?._id,
        user: req.userAuthId,
        rating,
        comment
    })

    // push the review id to the product's review array
    productFound.reviews.push(review?._id);
    await productFound.save();



    res.status(201).json({
        status: "success",
        message: "Review created successfully",
        review
    })
})

module.exports = { createReview }