const jwt = require('jsonwebtoken');

const generateJWT = (id, secret, time) => {
    return jwt.sign({ id }, secret, { expiresIn: time })
}

exports.generateJWT = generateJWT;