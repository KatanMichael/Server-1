'use strict';



exports.calculatePOST = function(body,operation) 
{
    return new Promise(function(resolve, reject) 
    {
      var respond = {};
      respond['application/json'] = {
        "result" : prefomeCalculation(body["number1"],body["number2"],operation)
  };
      if (Object.keys(respond).length > 0) {
        resolve(respond[Object.keys(respond)[0]]);
      } else {
        resolve();
      }
    });
  }

  const prefomeCalculation = (number1,number2, operetaion) => {
    let result;
    switch(operetaion)
  {
    
    case "+":
      {
        result = number1 + number2;
        break;
      }
    case "-": 
    {
      result = number1 - number2;
      break;
    }
    case "*":
      {
        result = number1 * number2;
        break;
      }
    case "/":
      {
        result = number1 / number2;
        break;
      }
  }
  return result;
}