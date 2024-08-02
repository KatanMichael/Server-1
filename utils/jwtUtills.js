require('dotenv').config()
const jwt = require('jsonwebtoken')

exports.verifyToken = function(verifyToken,next) 
{
    console.log(verifyToken)
    jwt.verify(verifyToken,process.env.ACCESS_TOKEN)
}