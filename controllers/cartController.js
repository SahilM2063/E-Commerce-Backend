const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc = Get User Cart
// @route = GET /api/v1/cart
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

module.exports = {
    getUserCart
}