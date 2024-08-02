'use strict';


exports.calculatePOST = function(body) 
{
    return new Promise(function(resolve, reject) 
    {
      var examples = {};
        examples['application/json'] = {
        "result" : body["number1"] + body["number2"]
  };
      if (Object.keys(examples).length > 0) {
        resolve(examples[Object.keys(examples)[0]]);
      } else {
        resolve();
      }
    });
  }
