const express = require('express');
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { upload } = require("../config/fileUpload")

const productRoutes = express.Router();

productRoutes.post('/create-product', isLoggedIn, upload.array('images'), createProduct)
productRoutes.get('/getAll', getAllProducts)
productRoutes.get('/:id', getSingleProduct)
productRoutes.put('/:id', isLoggedIn, updateProduct)
productRoutes.delete('/:id', isLoggedIn, deleteProduct)

exports.default = productRoutes;