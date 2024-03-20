const express = require('express');
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { upload } = require("../config/fileUpload");
const isAdmin = require('../middlewares/isAdmin');

const productRoutes = express.Router();

productRoutes.post('/create-product', isLoggedIn, isAdmin, upload.array('images'), createProduct)
productRoutes.get('/getAll', getAllProducts)
productRoutes.get('/:id', getSingleProduct)
productRoutes.put('/:id', isLoggedIn, isAdmin, upload.array('images'), updateProduct)
productRoutes.delete('/:id', isLoggedIn, isAdmin, deleteProduct)

module.exports = productRoutes;