
'use strict';
const utils = require('../utils/writer.js');
const CalculateService = require('../service/CalculateService.js')
const JTWUtills = require('../utils/jwtUtills.js')

module.exports.calculatePOST = function calculatePOST (req, res, next, body) 
{
    const authHeaders = req.headers["authorization"]
    let token = req.headers["authorization"].split(' ')[1];
    JTWUtills.verifyToken(token,next)
    CalculateService.calculatePOST(body)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  };

