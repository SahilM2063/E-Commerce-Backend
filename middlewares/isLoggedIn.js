const { getTokenFromHeader } = require("../utils/getTokenFromHeader")
const { verifyToken } = require("../utils/verifyToken")

const isLoggedIn = (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req)
    if (!token) {
        throw new Error("No token found, Please log in again")
    }
    // verify token
    const decodedUser = verifyToken(token, process.env.JWT_SECRET)
    if (!decodedUser) {
        throw new Error("Invalid / Expired Token, Please log in again")
    } else {
        req.userAuthId = decodedUser?.id;
        next();
    }
}

module.exports = { isLoggedIn }