const express = require('express');
const { createColor, getAllColors, getSingleColor, updateColor, deleteColor } = require('../controllers/colorController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');

const colorRoutes = express.Router();

colorRoutes.post('/create-color', isLoggedIn, isAdmin, createColor);
colorRoutes.get('/getAll', getAllColors);
colorRoutes.get('/:id', getSingleColor);
colorRoutes.put('/:id', isLoggedIn, isAdmin, updateColor);
colorRoutes.delete('/:id', isLoggedIn, isAdmin, deleteColor);

exports.default = colorRoutes;