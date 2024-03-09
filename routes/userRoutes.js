const express = require('express');
const { registerUser, loginUser, userProfile, updateShippingAddress, loginWithGoogle } = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');


const userRoutes = express.Router();


userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/profile', isLoggedIn, userProfile);
userRoutes.put('/update-shipping', isLoggedIn, updateShippingAddress)

exports.default = userRoutes;