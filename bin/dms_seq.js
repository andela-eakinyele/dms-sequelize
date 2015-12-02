#!/usr/bin/env node

var program = require('commander');
var _ = require("lodash");
var fs = require("fs");


var authSyncModels = require("./../src/dbsync");
var userFunc = require("./../src/userMthds");
var roleFunc = require("./../src/roleMthds");
var docFunc = require("./../src/docMthds");
var helpFunc = require("./../src/helpfunc");

var userData = ["firstname", "lastname", "username", "password", "rolename", "email"];
var docData = ["userid", "documentName", "title", "content", "access"];
var roleData = ["rolename"];
var arrModelFunc = [userFunc, docFunc, roleFunc];
var data = [userData, docData, roleData];

program
  .version('0.0.1')
  .usage('<cmd> [options] [parameters...]')
  .option("-f, --filemode <file>", "filepath for data")
  .parse(process.argv);

var args = program.args;

// console.log(/^getAll\w+(By)/.test(args[0]));
// console.log(/^getAll\w+^[(?:By)]/.test(args[0]));

if (!args.length) {
  program.outputHelp();
  process.exit(1);
}
// get equivalent command function
function getModelFunc(cmdArg) {
  modelFunc = _.filter(arrModelFunc, function(modelMthd, index) {
    return modelMthd[cmdArg] !== undefined;
  });
  if (modelFunc[0]) {
    var index = arrModelFunc.indexOf(modelFunc[0]);
    return [modelFunc[0][cmdArg], data[index]];
  }
  return "Invalid Command";
}
var readdata = function(file) {
  var _read = fs.readFileSync(file, 'utf8');
  return _read.split("\n");
};
authSyncModels.runner().then(function() {

  var useFunc = getModelFunc(args[0]);
  if (typeof useFunc[0] !== "function") {
    console.log(useFunc);
    program.outputHelp();
    process.exit(1);
  }

  // create user mode
  if (/^create/.test(args[0])) {
    if (!program.filemode) {
      var t_Args = args.slice(1);
      if (t_Args.length === useFunc[1].length) {
        var createData = _.zipObject(useFunc[1], args.slice(1));
        useFunc[0](createData).then(function(result) {
          console.log(result);
          process.exit(0);
        }).catch(function(err) {
          console.log(err);
          process.exit(1);
        });
      } else {
        console.log("fill missing arguments: " + _.takeRight(useFunc[1], useFunc[1].length - t_Args.length).join(" "));
        process.exit(1);
      }
    } else {
      var fileData = readdata(program.filemode);
      _.forEach(fileData, function(fdata, index) {
        var usable = fdata.replace(/\r\n/).trim().split(/[\s]+/);
        if (usable.length === useFunc[1].length) {
          var createData = _.zipObject(useFunc[1], usable);
          useFunc[0](createData).then(function(result) {
            console.log(JSON.stringify(result));
            if (index === fileData.length - 1) {
              process.exit(0)
            };
          }).catch(function(err) {
            console.log(err);
          });
        } else {
          var miss = _.takeRight(useFunc[1], useFunc[1].length - usable.length).join(" ");
          console.log("fill missing arguments in line: " + (index + 1) + " " + miss);
           if (index === fileData.length - 1) {
              process.exit(0)
            };
        }
      });
    }
  } else if (/^getAll/.test(args[0])) {
    if (!(/(By)/.test(args[0]))) {
      useFunc[0](args[1]).then(function(result) {
        if (result.length === 0) {
          console.log("No data");
          process.exit(0);
        }
        _.forEach(result, function(_result, index) {
          console.log(JSON.stringify(_result));
          console.log("\n");
          if (index === result.length - 1) {
            process.exit(0);
          }
        });
      }).catch(function(err) {
        console.log(err);
        if (index === result.length - 1) {
          process.exit(1);
        }
      });
    } 
    // define command including the BY keyword
    else {
      if (isNaN(args[1])) {
        args[2] = args[1];
        args[1] = undefined;
      }
      console.log(args);
      useFunc[0](args[1], args[2]).then(function(result) {
        if (result.length === 0) {
          console.log("No data");
          process.exit(0);
        }
        _.forEach(result, function(_result, index) {
          console.log(JSON.stringify(_result));
          console.log("\n");
          if (index === result.length - 1) {
            process.exit(0);
          }
        });
      }).catch(function(err) {
        console.log(err);
        if (index === result.length - 1) {
          process.exit(1);
        }
      });
    }
  }


});