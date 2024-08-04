
'use strict';
const utils = require('../utils/writer.js');
const CalculateService = require('../service/CalculateService.js')
const JTWUtills = require('../utils/jwtUtills.js')


const verifyHeaders = (req,res) =>{
  
  const authHeaders = req.headers["authorization"]

    if(!authHeaders) {
      res.status(401).json({
        error: "Unauthorized"
    });
    return true
    }

  let token = req.headers["authorization"].split(' ')[1];

  if(token == undefined)
    {
      res.status(401).json({
        error: "Unauthorized"
        });
        return true;
    } 

    return false;
}

const verifyBody = (req,res) => {
  
  if(req.body["number1"] == undefined || req.body["number2"] == undefined) 
  {
    res.status(400).json({'error': "Bad Request"})
    return true;
  }
  return false;
}

module.exports.calculatePOST = function calculatePOST (req, res, body) 
{

    if(verifyHeaders(req,res)) return res; // verify the headers
    if(JTWUtills.verifyToken(req,res)) return res; // verify the Token
    if(verifyBody(req,res)) return res; // verify the body of the request

    CalculateService.calculatePOST(req.body)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  };

