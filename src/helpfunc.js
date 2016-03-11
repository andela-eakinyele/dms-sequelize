// var bcrypt = require('bcryptjs');
var fs = require("fs");
var _ = require("lodash");


var hashp = function(t_Args) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(t_Args[3], 10, function(err, hash) {
      if (err) reject(Error(err));
      t_Args[3] = hash;
      resolve(t_Args);
    });
  });
}

var readdata = function(file) {
  var _read = fs.readFileSync(file, 'utf8');
  return _read.split("\n");
};
