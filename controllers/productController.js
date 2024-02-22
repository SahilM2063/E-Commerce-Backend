const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require('express-async-handler');

// @desc = Create Product
// @route = POST /api/v1/products
// @access = Private/Admin

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, brand, category, sizes, colors, user, images, price, totalQty } = req.body;

    // check if product exists
    const productExist = await Product.findOne({ name });

    // if product exists it returns back
    if (productExist) {
        throw new Error('Product already exists');
    }
    // find the category
    const categoryExist = await Category.findOne({ name: category });
    if (!categoryExist) {
        throw new Error('Category not found, Please create a category first or check the category name');
    }

    // create the product
    const product = await Product.create({
        name,
        description,
        brand,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        images,
        price,
        totalQty
    });

    // push the product id to the category's product array
    categoryExist.products.push(product._id);
    await categoryExist.save();

    // success response
    res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        product
    });
})


// @desc = Get ALl Products
// @route = POST /api/v1/products/getAll
// @access = Public

const getAllProducts = asyncHandler(async (req, res) => {

    let productQuery = Product.find();

    // search by name
    if (req.query.name) {
        productQuery = productQuery.find({ name: { $regex: req.query.name, $options: 'i' } });
    }
    // search by brand
    if (req.query.brand) {
        productQuery = productQuery.find({ brand: { $regex: req.query.brand, $options: 'i' } });
    }
    // search by category
    if (req.query.category) {
        productQuery = productQuery.find({ category: { $regex: req.query.category, $options: 'i' } });
    }
    // search by colors
    if (req.query.colors) {
        productQuery = productQuery.find({ colors: { $regex: req.query.colors, $options: 'i' } });
    }
    // search by sizes
    if (req.query.sizes) {
        productQuery = productQuery.find({ sizes: { $regex: req.query.sizes, $options: 'i' } });
    }
    // Filters by price Range
    if (req.query.price) {
        const priceRange = req.query.price.split('-');

        productQuery = productQuery.find({ price: { $gte: priceRange[0], $lte: priceRange[1] } });
    }

    // Pagination
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

    // pagination results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // setting data 
    const products = await productQuery;

    res.status(200).json({
        status: 'success',
        total,
        pagination,
        message: 'Products Fetched successfully',
        result: products.length,
        products
    })
})

// @desc = Get Single Product
// @route = POST /api/v1/products/:id
// @access = Public

const getSingleProduct = asyncHandler(async (req, res) => {
    // fetch product from id
    const product = await Product.findById(req.params.id);

    // check if product exists
    if (!product) {
        throw new Error('Product not found');
    } else {
        res.status(200).json({
            status: 'success',
            message: 'Product Fetched successfully',
            product
        })
    }
})

// @desc = Update Product
// @route = PUT /api/v1/products/:id
// @access = Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
    const { name, description, brand, category, sizes, colors, user, images, price, totalQty } = req.body;

    // check if product exists
    const productExist = await Product.findById(req.params.id);
    if (!productExist) {
        throw new Error('Product not found');
    } else {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name,
            description,
            brand,
            category,
            sizes,
            colors,
            user: req.userAuthId,
            images,
            price,
            totalQty
        }, {
            new: true
        });
        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            product
        })
    }
})

// @desc = Delete Product
// @route = DELETE /api/v1/products/:id
// @access = Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
    // check if product exists
    const productExist = await Product.findById(req.params.id);
    if (!productExist) {
        throw new Error('Product not found');
    } else {
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
        })
    }
})


module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct };