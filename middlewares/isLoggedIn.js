const { getTokenFromHeader } = require("../utils/getTokenFromHeader")
const { verifyToken } = require("../utils/verifyToken")

const isLoggedIn = (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req)

    // verify token
    const decodedUser = verifyToken(token)
    if (!decodedUser) {
        throw new Error("Invalid / Expired Token, Please log in again")
    } else {
        req.userAuthId = decodedUser?.id;
        next();
    }
}

module.exports = { isLoggedIn }