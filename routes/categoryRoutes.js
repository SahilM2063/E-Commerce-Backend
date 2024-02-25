const express = require("express");
const { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { uploadCategoryFile } = require("../config/categoryFileUpload")

const categoryRoutes = express.Router();

categoryRoutes.post('/create-category', isLoggedIn, uploadCategoryFile.single('image'), createCategory);
categoryRoutes.get('/getAll', getAllCategories);
categoryRoutes.get('/:id', getSingleCategory);
categoryRoutes.put('/:id', isLoggedIn, updateCategory);
categoryRoutes.delete('/:id', isLoggedIn, deleteCategory);

exports.default = categoryRoutes;