const { User } = require("../models/User.js")
const { verifyToken } = require("../utlis/token.js")

const isAuth = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.replace("Bearer ", "")

        if(!token){
            throw new Error({error: "No tienes autorización para realizar está operación"})
        }

        const decodedInfo = verifyToken(token)

        const user = await User.findOne({ email: decodedInfo.userEmail }).selected("+password")

        if(!user){
            throw new Error({ error: "No tienes autorización para realizar esta operación"})
        }

        req.user = user;

        next()

    } catch (error){
        return res.status(401). json(error)
    }
}

module.exports = {isAuth}