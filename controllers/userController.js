const User = require('../models/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { generateJWT } = require('../utils/generateToken');
const { getTokenFromHeader } = require('../utils/getTokenFromHeader');
const { verifyToken } = require('../utils/verifyToken');

// @desc = Register User
// @route = POST /api/v1/users/register
// @access = Public

const registerUser = asyncHandler(
    async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            const userFound = await User.findOne({ email });
            // if email already exists it returns 
            if (userFound) {
                throw new Error('User already exists');
            }
            // hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            //create the user
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword
            });
            // get saved user
            const savedUser = await User.findOne({ email });
            // success response
            res.status(201).json({
                status: "success",
                msg: 'User Registered Successfully',
                data: user,
                token: generateJWT(savedUser?._id)
            })
        } catch (error) {
            throw new Error(error);
        }
    }
)

// @desc = Login User
// @route = POST /api/v1/users/login
// @access = Public

const loginUser = asyncHandler(
    async (req, res) => {
        try {
            const { email, password } = req.body;
            // check if user exists
            const userFound = await User.findOne({ email });
            // if user not exist --> return 
            if (!userFound) {
                throw new Error('Invalid Credentials');
            }
            // compare the password
            const isPassMatched = await bcrypt.compare(password, userFound.password);
            // if password is matched then return success message 
            if (isPassMatched) {
                return res.status(200).json({
                    status: "success",
                    msg: 'User Logged in Successfully',
                    userFound,
                    token: generateJWT(userFound?._id)
                })
            } else {
                throw new Error('Invalid Credentials');
            }
        } catch (error) {
            throw new Error(error);
        }
    }
)

// @desc = Update User Password
// @route = PUT /api/v1/users/update-password
// @access = Private

const updateUserPassword = asyncHandler(
    async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const user = await User.findById(req.userAuthId);
            const isPassMatched = await bcrypt.compare(oldPassword, user.password);
            if (isPassMatched) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt)
                user.password = hashedPassword;
                await user.save();
                res.status(200).json({
                    status: "success",
                    msg: "Password updated successfully",
                    user
                })
            } else {
                throw new Error('Invalid Credentials');
            }
        } catch (error) {
            throw new Error(error);
        }
    }
)

// @desc = User Profile
// @route = POST /api/v1/users/profile
// @access = Private

const userProfile = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.userAuthId).populate('orders');
        res.status(200).json({
            status: "success",
            message: "User profile fetched",
            user
        })
    }
)

// @desc = Update shipping address
// @route = PUR /api/v1/users/update-shipping
// @access = Private

const updateShippingAddress = asyncHandler(async (req, res) => {
    const { firstName, lastName, address, city, postalCode, province, country, phoneNumber } = req.body

    const user = await User.findByIdAndUpdate(req.userAuthId, {
        shippingAddress: {
            firstName, lastName, address, city, postalCode, province, country, phoneNumber
        },
        hasShippingAddress: true
    }, { new: true });
    res.status(200).json({
        status: "success",
        message: "User shipping address updated",
        user
    })
})


module.exports = { registerUser, loginUser, updateUserPassword, userProfile, updateShippingAddress }
