const express = require('express');
const { registerUser, loginUser, userProfile, updateShippingAddress, updateUserPassword, resetPasswordLink, resetPassword } = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { generateJWT } = require('../utils/generateToken');


const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.post('/update-password', isLoggedIn, updateUserPassword);
userRoutes.post('/reset-password-link', resetPasswordLink);
userRoutes.post('/reset-password/:id/:token', resetPassword);
userRoutes.get('/profile', isLoggedIn, userProfile);
userRoutes.put('/update-shipping', isLoggedIn, updateShippingAddress);

module.exports = userRoutes;