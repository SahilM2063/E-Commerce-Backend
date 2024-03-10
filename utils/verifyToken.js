const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return false;
        } else {
            return decoded;
        }
    });
}

module.exports = { verifyToken };