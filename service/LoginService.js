const jwt = require('jsonwebtoken')
require('dotenv').config()

function getRandomNumber() {
    return {number: Math.floor(Math.random() * 1000000) + 1};
}

/**
 * Get a new Token
 *
 * returns inline_response_200_1
 **/
exports.loginGET = function() {
    return new Promise(function(resolve) 
    {   let jsonWebToken
        jsonWebToken= jwt.sign(getRandomNumber(),process.env.ACCESS_TOKEN, {expiresIn: '1s'})
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
  