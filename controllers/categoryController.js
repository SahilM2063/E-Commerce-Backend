const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");


// @desc = Create Category
// @route = POST /api/v1/categories
// @access = Private/Admin

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // fetch category if exists
    const categoryExist = await Category.findOne({ name });

    // check if category existed or return
    if (categoryExist) {
        throw new Error('Category already exists');
    } else {
        // create category
        const category = await Category.create({
            name: name.toLowerCase(),
            user: req.userAuthId
        });

        res.status(201).json({
            status: "success",
            message: "Category created successfully",
            category
        })
    }
})

// @desc = Get all categories
// @route = GET /api/v1/categories/getALl
// @access = Public

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});

    res.status(200).json({
        status: "success",
        categories
    })
})


// @desc = Get Single Category
// @route = GET /api/v1/categories/:id
// @access = Public

const getSingleCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new Error('Category not found');
    } else {
        res.status(200).json({
            status: "success",
            category
        })
    }
})

// @desc = Update Category
// @route = PUT /api/v1/categories/:id
// @access = Private/Admin

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new Error('Category not found');
    } else {
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name
        }, { new: true });
        res.status(200).json({
            status: "success",
            message: "Category updated successfully",
            category
        })
    }
})

// @desc = Delete Category
// @route = DELETE /api/v1/categories/:id
// @access = Private/Admin

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new Error('Category not found');
    } else {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            message: "Category deleted successfully"
        })
    }
})

module.exports = { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory };