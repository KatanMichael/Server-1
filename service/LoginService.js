const jwt = require('jsonwebtoken')
require('dotenv').config()

function getRandomNumber() {
    return {number: Math.floor(Math.random() * 1000000) + 1};
}

/**
 * Get a new Token
 **/

exports.loginGET = function() {
    return new Promise(function(resolve) 
    {
        // generate a JWT with a payload between 1 - 1000000
        const jsonWebToken= jwt.sign(getRandomNumber(),process.env.ACCESS_TOKEN, {expiresIn: '1m'})
        let respond = {};
        respond['application/json'] = {
            "access_token" : jsonWebToken,
            "token_type" : "Bearer",
            "expires_in" : 15
  };
      if (Object.keys(respond).length > 0) {
        resolve(respond[Object.keys(respond)[0]]);
      } else {
        resolve();
      }
    });
  }
  