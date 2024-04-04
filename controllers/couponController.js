const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');


// @desc = Create Coupon
// @route = POST /api/v1/coupons/create-coupon
// @access = Private/Admin

const createCoupon = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;

    // check if coupon exists
    const couponExist = await Coupon.findOne({ code });
    if (couponExist) {
        throw new Error('Coupon already exists');
    }

    if (isNaN(discount)) {
        throw new Error('Discount must be a number');
    }

    const coupon = await Coupon.create({
        code: code?.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId
    });

    res.status(201).json({
        status: 'success',
        message: 'Coupon created successfully',
        coupon
    })
});


// @desc = Get all Coupons
// @route = POST /api/v1/coupons/getALl
// @access = Private/Admin

const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();

    res.json({
        status: 'success',
        message: 'All coupons fetched',
        coupons
    })
})


// @desc = Get single coupon
// @route = GET /api/v1/coupons/:id
// @access = Private/Admin

const getSingleCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code });
    if (!coupon) {
        throw new Error('Coupon not found');
    } else {
        res.status(200).json({
            status: "success",
            coupon
        })
    }
})

// @desc = Update coupon
// @route = PUT /api/v1/coupons/:id
// @access = Private/Admin

const updateCoupon = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
        code: code?.toUpperCase(),
        startDate,
        endDate,
        discount
    }, { new: true });

    res.status(200).json({
        status: "success",
        message: "Coupon updated successfully",
        coupon
    })
})


// @desc = Delete coupon
// @route = DELETE /api/v1/coupons/:id
// @access = Private/Admin

const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        throw new Error('Coupon not found');
    } else {
        await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            message: "Coupon deleted successfully"
        })
    }
});




module.exports = { createCoupon, getAllCoupons, getSingleCoupon, updateCoupon, deleteCoupon }