const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const isAdmin = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userAuthId);
    if (user?.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Access denied!, Admin Only');
    }
})

module.exports = isAdmin