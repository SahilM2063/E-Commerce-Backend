const User = require("../models/User");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { generateJWT } = require("../utils/generateToken");
const { getTokenFromHeader } = require("../utils/getTokenFromHeader");
const { verifyToken } = require("../utils/verifyToken");
const transporter = require("../config/emailConfig");
const baseFrontendUrl = require("../utils/baseUrl");

// @desc = Register User
// @route = POST /api/v1/users/register
// @access = Public

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userFound = await User.findOne({ email });
    // if email already exists it returns
    if (userFound) {
      throw new Error("User already exists");
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    // get saved user
    const savedUser = await User.findOne({ email });
    // success response
    res.status(201).json({
      status: "success",
      msg: "User Registered Successfully",
      userFound: user,
      token: generateJWT(savedUser?._id, process.env.JWT_SECRET, "1d"),
    });
  } catch (error) {
    throw new Error(error);
  }
});

// @desc = Login User
// @route = POST /api/v1/users/login
// @access = Public

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exists
    const userFound = await User.findOne({ email });
    // if user not exist --> return
    if (!userFound) {
      throw new Error("Invalid Credentials");
    }
    // compare the password
    const isPassMatched = await bcrypt.compare(password, userFound.password);
    // if password is matched then return success message
    if (isPassMatched) {
      return res.status(200).json({
        status: "success",
        msg: "User Logged in Successfully",
        userFound,
        token: generateJWT(userFound?._id, process.env.JWT_SECRET, "1d"),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// @desc = Update User Password
// @route = PUT /api/v1/users/update-password
// @access = Private

const updateUserPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.userAuthId);
    const isPassMatched = await bcrypt.compare(oldPassword, user.password);
    if (isPassMatched) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({
        status: "success",
        msg: "Password updated successfully",
        user,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// @desc = Reset Password Link
// @route = POST /api/v1/users/resetPassEmail
// @access = Private

const resetPasswordLink = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const emailLinkSecret = user?._id + process.env.JWT_SECRET;
    const emailLinkToken = generateJWT(user?._id, emailLinkSecret, "15m");
    const resetLink = `http://localhost:5173/user/reset-password/${user?._id}/${emailLinkToken}`;
    let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Fasco-Ecommerce - Reset Password",
      html: `
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
    <tr>
      <td style="padding: 20px;">
        <h1 style="color: #000000; margin-bottom: 20px; text-align: center; font-family: Volkhov, sans-serif;">Fasco-Ecommerce</h1>
        <h2 style="color: #333333; margin-bottom: 20px; text-align: center;">Reset Your Password</h2>
        <p style="color: #555555; line-height: 1.5; text-align: center;">Click the button below to reset your password:</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-weight: bold; background-color: #000; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p style="color: #555555; line-height: 1.5; text-align: center; margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </td>
    </tr>
  </table>
</body>`,
    });
    res.status(200).json({
      status: "success",
      msg: "Reset password link sent to your email, Only vaild for 15 minutes.",
      info,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// @desc = Reset Password
// @route = POST /api/v1/users/reset-password/:id/:token
// @access = Private

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { id, token } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Invalid link");
    }
    const emailLinkSecret = user?._id + process.env.JWT_SECRET;
    const isVerified = verifyToken(token, emailLinkSecret);
    if (!isVerified) {
      throw new Error("Invalid link");
    }
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({
        status: "success",
        msg: "Password reset successfully",
      });
    } else {
      throw new Error("All fields are required");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// @desc = Get All Users
// @route = GET /api/v1/users
// @access = Private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    message: "All users fetched",
    users,
  });
});

// @desc = User Profile
// @route = POST /api/v1/users/profile
// @access = Private

const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  res.status(200).json({
    status: "success",
    message: "User profile fetched",
    user,
  });
});

// @desc = Update User Profile
// @route = PUT /api/v1/users/:id
// @access = Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const foundUser = await User.findById(userId);
  if (!foundUser) {
    throw new Error("User not found");
  }

  let pfp;
  if (req.file) {
    pfp = req.file.path;
  } else {
    pfp = foundUser.pfp;
  }

  const { firstName, lastName, email, gender } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, email, gender, pfp },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "User profile updated",
    user,
  });
});

// @desc = Update shipping address
// @route = PUR /api/v1/users/update-shipping
// @access = Private

const updateShippingAddress = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const foundUser = await User.findById(userId);
  if (!foundUser) {
    throw new Error("User not found");
  }
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    state,
    country,
    phoneNumber,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        state,
        country,
        phoneNumber,
      },
      hasShippingAddress: true,
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "User shipping address updated",
    user,
  });
});

// @desc = Delete User
// @route = DELETE /api/v1/users/:id
// @access = Private

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("User not found");
  } else {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserPassword,
  userProfile,
  updateShippingAddress,
  resetPasswordLink,
  resetPassword,
  deleteUser,
  updateUserProfile,
};
