const express = require('express');
const { registerUser, loginUser, userProfile, updateShippingAddress, loginWithGoogle } = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const passport = require('passport');
const { generateJWT } = require('../utils/generateToken');


const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/profile', isLoggedIn, userProfile);
userRoutes.put('/update-shipping', isLoggedIn, updateShippingAddress);

// Google OAuth routes
userRoutes.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

userRoutes.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, generate JWT
        const token = generateJWT(req.user._id);
        // Redirect the user to your application with the JWT
        return res.status(200).json({
            status: "success",
            msg: 'User Logged in Successfully',
            userFound: user,
            token: generateJWT(userFound?._id)
        })
    }
);

module.default = userRoutes;