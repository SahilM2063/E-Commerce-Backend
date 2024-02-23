const express = require('express');
const { createColor, getAllColors, getSingleColor, updateColor, deleteColor } = require('../controllers/colorController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const colorRoutes = express.Router();

colorRoutes.post('/create-color', isLoggedIn, createColor);
colorRoutes.get('/getAll', getAllColors);
colorRoutes.get('/:id', getSingleColor);
colorRoutes.put('/:id', isLoggedIn, updateColor);
colorRoutes.delete('/:id', isLoggedIn, deleteColor);

exports.default = colorRoutes;