'use strict';


exports.calculatePOST = function(body) 
{
    return new Promise(function(resolve, reject) 
    {
      var respond = {};
      respond['application/json'] = {
        "result" : body["number1"] + body["number2"]
  };
      if (Object.keys(respond).length > 0) {
        resolve(respond[Object.keys(respond)[0]]);
      } else {
        resolve();
      }
    });
  }
