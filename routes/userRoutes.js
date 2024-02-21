const express = require('express');
const { registerUser, loginUser, userProfile } = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');


const userRoutes = express.Router();


userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/profile', isLoggedIn, userProfile);

exports.default = userRoutes;