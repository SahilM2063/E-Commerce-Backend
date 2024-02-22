const express = require("express");
const { createBrand, getAllBrands, getSingleBrand, updateBrand, deleteBrand } = require("../controllers/brandController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

const brandRoutes = express.Router();

brandRoutes.post('/create-brand', isLoggedIn, createBrand);
brandRoutes.get('/getAll', getAllBrands);
brandRoutes.get('/:id', getSingleBrand);
brandRoutes.put('/:id', isLoggedIn, updateBrand);
brandRoutes.delete('/:id', isLoggedIn, deleteBrand);

exports.default = brandRoutes;