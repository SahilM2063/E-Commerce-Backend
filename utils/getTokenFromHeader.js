const getTokenFromHeader = (req) => {
    // getting jwt token from headers
    const token = req?.headers?.authorization?.split(' ')[1];
    if (token === undefined) {
        return "No token found!";
    } else {
        return token;
    }
}

module.exports = { getTokenFromHeader }