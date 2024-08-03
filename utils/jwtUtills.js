require('dotenv').config()
const jwt = require('jsonwebtoken')

exports.verifyToken = function(req,res)
{   
    let verifyToken = req.headers["authorization"].split(' ')[1];
    
    let status;
    let respondJson = {}
    try{
        jwt.verify(verifyToken,process.env.ACCESS_TOKEN)
    }catch(e)
    {
        switch(e.name)
        {
            
            case "TokenExpiredError":
                {
                    respondJson = {error: "Unauthorized"}
                    status = 401;
                    res.status(status).json(respondJson)
                    break;
                }
            case "JsonWebTokenError":
                {
                    respondJson = {error: "Forbidden"}
                    status = 403;
                    res.status(status).json(respondJson)
                    break;
                }
        }
    }
    if(status) return true;
    return false;
}