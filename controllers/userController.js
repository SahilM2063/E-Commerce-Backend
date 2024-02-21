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
        const { username, email, password } = req.body;

        const userFound = await User.findOne({ email });
        // if email already exists it returns 
        if (userFound) {
            throw new Error('User already exists');
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create the user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        // success response
        res.status(201).json({
            status: "success",
            msg: 'User Registered Successfully',
            data: user
        })
    }
)

// @desc = Login User
// @route = POST /api/v1/users/login
// @access = Public

const loginUser = asyncHandler(
    async (req, res) => {
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
    }
)

// @desc = User Profile
// @route = POST /api/v1/users/profile
// @access = Private

const userProfile = asyncHandler(
    async (req, res) => {
        // get token from header
        const token = getTokenFromHeader(req)

        // verify token
        const verified = verifyToken(token);
        console.log(req)
        res.status(200).json({
            "message": "User Profile",
        })
    }
)

module.exports = { registerUser, loginUser, userProfile }
