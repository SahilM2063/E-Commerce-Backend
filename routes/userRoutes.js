const express = require('express');
const { registerUser, loginUser, userProfile, updateShippingAddress, updateUserPassword, resetPasswordLink, resetPassword, getAllUsers, deleteUser, updateUserProfile } = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin')
const { generateJWT } = require('../utils/generateToken');
const { uploadUserProfile } = require('../config/userProfileUpload');



const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/getAll', getAllUsers);
userRoutes.post('/update-password', isLoggedIn, updateUserPassword);
userRoutes.post('/reset-password-link', resetPasswordLink);
userRoutes.post('/reset-password/:id/:token', resetPassword);
userRoutes.get('/profile', isLoggedIn, userProfile);
userRoutes.put('/:id', isLoggedIn, uploadUserProfile.single('pfp'), updateUserProfile);
userRoutes.put('/update-shipping', isLoggedIn, updateShippingAddress);
userRoutes.delete('/:id', isLoggedIn, isAdmin, deleteUser);

module.exports = userRoutes;