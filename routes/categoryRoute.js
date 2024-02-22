const express = require("express");
const { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

const categoryRoutes = express.Router();

categoryRoutes.post('/create-category', isLoggedIn, createCategory);
categoryRoutes.get('/getAll', getAllCategories);
categoryRoutes.get('/:id', getSingleCategory);
categoryRoutes.put('/:id', isLoggedIn, updateCategory);
categoryRoutes.delete('/:id', isLoggedIn, deleteCategory);

exports.default = categoryRoutes;