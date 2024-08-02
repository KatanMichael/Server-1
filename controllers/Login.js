'use strict';

var utils = require('../utils/writer.js');
let LoginService = require('../service/LoginService.js')

module.exports.loginGET = function loginGET (req, res, next) {
    LoginService.loginGET()
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  };
  