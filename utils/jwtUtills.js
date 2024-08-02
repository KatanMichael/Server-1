require('dotenv').config()
const jwt = require('jsonwebtoken')

exports.verifyToken = function(verifyToken,next) 
{
    jwt.verify(verifyToken,process.env.ACCESS_TOKEN)
}