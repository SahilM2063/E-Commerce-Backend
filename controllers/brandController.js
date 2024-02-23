const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');

// @desc = Create Brand
// @route = POST /api/v1/brands
// @access = Private/Admin

const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // fetch brand if exists
    const brandExist = await Brand.findOne({ name });

    // check if brand existed or return
    if (brandExist) {
        throw new Error('Brand already exists');
    } else {
        // create brand
        const brand = await Brand.create({
            name: name.toLowerCase(),
            user: req.userAuthId
        });

        res.status(201).json({
            status: "success",
            message: "Brand created successfully",
            brand
        })
    }
})

// @desc = Get all brands
// @route = GET /api/v1/brands/getALl
// @access = Public

const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find({});

    res.status(200).json({
        status: "success",
        brands
    })
})


// @desc = Get Single Brand
// @route = GET /api/v1/brands/:id
// @access = Public

const getSingleBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        throw new Error('Brand not found');
    } else {
        res.status(200).json({
            status: "success",
            brand
        })
    }
})

// @desc = Update Brand
// @route = PUT /api/v1/brands/:id
// @access = Private/Admin

const updateBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        throw new Error('Brand not found');
    } else {
        const { name } = req.body;
        const brand = await Brand.findByIdAndUpdate(req.params.id, {
            name
        }, { new: true });
        res.status(200).json({
            status: "success",
            message: "Brand updated successfully",
            brand
        })
    }
})

// @desc = Delete Brand
// @route = DELETE /api/v1/brands/:id
// @access = Private/Admin

const deleteBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        throw new Error('Brand not found');
    } else {
        await Brand.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            message: "Brand deleted successfully"
        })
    }
});


module.exports = { createBrand, getAllBrands, getSingleBrand, updateBrand, deleteBrand }