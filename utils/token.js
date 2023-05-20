const jwt = require("jsonwebtoken")

require("dotenv").config()

const generateToken = (id, email) => {
    if(!email || !id) {
        throw new Error("Email or userID missing")
    }

    const payload = {
        userId: id,
        userEmail: email,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d"});
    return token
}

const verifyToken = (token) => {
    if(!token){
        throw new Error("Token is missing")
    }

    const result = jwt.verify(token, process.env.JWT_SECRET)
    return result
}


module.exports = {generateToken, verifyToken}