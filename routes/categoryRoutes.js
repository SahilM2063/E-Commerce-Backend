const express = require("express");
const { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { uploadCategoryFile } = require("../config/categoryFileUpload");
const isAdmin = require("../middlewares/isAdmin");

const categoryRoutes = express.Router();

categoryRoutes.post('/create-category', isLoggedIn, isAdmin, uploadCategoryFile.single('image'), createCategory);
categoryRoutes.get('/getAll', getAllCategories);
categoryRoutes.get('/:id', getSingleCategory);
categoryRoutes.put('/:id', isLoggedIn, isAdmin, updateCategory);
categoryRoutes.delete('/:id', isLoggedIn, isAdmin, deleteCategory);

exports.default = categoryRoutes;