const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc = Get User Cart
// @route = GET /api/v1/cart/get-cart
// @access = Private

const getUserCart = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.userAuthId).populate('cart');

        if (!user) {
            throw new Error('User not found');
        }

        res.status(200).json({
            status: "success",
            message: "User cart fetched",
            user
        })
    } catch (error) {
        throw new Error(error);
    }
})

// @desc = Add Product into user Cart
// @route = POST /api/v1/cart/add-to-cart
// @access = Private

const addToCart = asyncHandler(async (req, res) => {
    try {
        const { productId, quantity, size, color, price } = req.body;
        if (!productId) {
            throw new Error('Product Id is required');
        }
        if (!quantity) {
            throw new Error('Quantity is required');
        }
        if (!size) {
            throw new Error('Size is required');
        }
        if (!color) {
            throw new Error('Color is required');
        }
        if (!price) {
            throw new Error('Price is required');
        }

        const user = await User.findById(req.userAuthId);
        if (!user) {
            throw new Error('User not found');
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const productExist = user.cart.find((item) => {
            return item.productId.toString() === productId.toString();
        })

        if (productExist) {
            throw new Error('Product already exist in cart');
        }

        user.cart.push({
            productId,
            quantity,
            size,
            color,
            price
        })

        await user.save();

        res.status(200).json({
            status: "success",
            message: "Product added to cart",
        })

    } catch (error) {
        throw new Error(error);
    }
})

// @desc = Remove Product from user Cart
// @route = POST /api/v1/cart/removeFromCart
// @access = Private

const removeFromCart = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            throw new Error('Product Id is required');
        }

        const user = await User.findById(req.userAuthId);
        if (!user) {
            throw new Error('User not found');
        }

        const productExist = await user.cart.find((item) => {
            return item._id.toString() === productId.toString();
        })

        if (!productExist) {
            throw new Error('Product not found in cart');
        }

        await User.updateOne(
            { _id: req.userAuthId },
            { $pull: { cart: { _id: productId } } }
        );

        res.status(200).json({
            status: "success",
            message: "Product removed from cart",
        })

    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    getUserCart, addToCart, removeFromCart
}
