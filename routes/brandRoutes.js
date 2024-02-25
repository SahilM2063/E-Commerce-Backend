const express = require("express");
const { createBrand, getAllBrands, getSingleBrand, updateBrand, deleteBrand } = require("../controllers/brandController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

const brandRoutes = express.Router();

brandRoutes.post('/create-brand', isLoggedIn, isAdmin, createBrand);
brandRoutes.get('/getAll', getAllBrands);
brandRoutes.get('/:id', getSingleBrand);
brandRoutes.put('/:id', isLoggedIn, isAdmin, updateBrand);
brandRoutes.delete('/:id', isLoggedIn, isAdmin, deleteBrand);

exports.default = brandRoutes;