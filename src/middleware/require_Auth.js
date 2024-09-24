const jwt = require("jsonwebtoken")
require("dotenv").config()

const Auth = (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization){
        return res.status(404).json({error: 'Authorization token is required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const {_id} = jwt.verify(token, process.env.JWTSecret)

        //find user by _id

        next()

    }catch (error){
        console.log(error)
        return res.status(404).json({error: "Request not authorized"})
    }
}

module.exports.Auth