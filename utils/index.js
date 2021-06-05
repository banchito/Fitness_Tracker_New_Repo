const jwt = require("jsonwebtoken");

const verifyToken = (headersAuth) => {
    const [, token]               = headersAuth.split("Bearer ");
    const validatedToken          = jwt.verify(token, process.env.JWT_SECRET);
    console.log("utils:", validatedToken);

    return validatedToken
}


module.exports = {verifyToken}