var Jwt = require('jsonwebtoken');
var Exception = require('../exceptions/exception')

var Util = {};

Util.responseMsg = function(data){
  return{
    statusCode: 200,
    data: data
  }
}

Util.isLoggedin = function(req, res, next){
  var token = req.headers['x-access-token'];
  if (!token) return next(new Exception('token is required !', 400))
  else {
    Jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) { 
      if (err) {
        next(new Exception('Token invalid error !', 401));
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
};

module.exports = Util;