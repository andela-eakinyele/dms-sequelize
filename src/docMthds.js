var users = require("./../model/Users");
var documents = require("./../model/Documents");
var roles = require("./../model/Roles");
var _ = require("lodash");

function verifyorCreateData(model, findargs, cargs) {
  return new Promise(function(resolve, reject) {
    model.findOne({
      where: findargs
    }).then(function(result) {
      if (result) {
        resolve([result, false]);
      } else {
        model.create(cargs).then(function(result) {
          // console.log("Created", cargs);
          resolve([result, true]);
        }).catch(function(err) {
          console.log("Error creating", cargs, err);
          reject(Error(err));
        });
      }
    }).catch(function(err) {
      console.log("Error verifying", findargs, err);
      reject(Error(err));
    });
  });
}

function destroyData(createdRoles, docData, cb) {
  documents.destroy({
    where: {
      documentName: docData.documentName
    }
  }).then(function(doc) {
    console.log("Cleaning up..... \n", docData.documentName, "removed");
    roles.destroy({
      where: {
        rolename: createdRoles
      }
    }).then(function(roles) {
      console.log(roles, "removed");
      cb(null, null);
    }).catch(function(err) {
      console.log("CreateDocument not Successful \nError encountered during cleanup");
      cb(err, null);
    });
  }).catch(function(err) {
    console.log("CreateDocument not Successful\nError encountered during cleanup");
    cb(err, null);
  });
};

exports.createDocument = function(docData) {
  var accessroles = docData.access.split(",")
    .map(function(val) {
      return val.trim();
    });
  var createdRoles = [];
  delete docData.access;
  return new Promise(function(resolve, reject) {
    // find or create if not exist document
    verifyorCreateData(documents, {
      documentName: docData.documentName,
      userid: docData.userid
    }, docData).then(function(result) {
      var doc = result[0];
      // if exist resolve to existing document
      if (!result[1]) {
        resolve("Document " + docData.documentName + " exists");
      } else { // use created document and populate relations table
        // populate each role with document
        accessroles.forEach(function(_role, index) {
          var args = {
            rolename: _role
          };
          // find or create if not exist role
          verifyorCreateData(roles, args, args).then(function(result) {
            // push to create if created
            if (result[1]) createdRoles.push(_role);
            // add document to role relation
            result[0].addDocument(doc).then(function() {
              // console.log("Added", docData.documentName, "to", _role);
              // check if all role populated
              if (index === accessroles.length - 1) {
                // then populate document with roles
                doc.addRoles(accessroles).then(function() {
                  // console.log("Added ", accessroles, "to", docData.documentName);
                  resolve(doc);
                }).catch(function(err) { // delete document and created roles if error encountered with docAddRoles
                  console.log("Error adding accessroles", err);
                  destroyData(createdRoles, docData, function(_err, done) {
                    if (_err) reject(Error(_err));
                    console.log("CreateDocument not Successful, Cleanup Done");
                    reject(Error(err));
                  });
                });
              }
            }).catch(function(err) { // delete document and created roles if error encountered with roleAddDoc
              console.log("Error adding doc to", _role, err);
              destroyData(createdRoles, docData, function(_err, done) {
                if (_err) {
                  console.log("CreateDocument not Successful, Cleanup Done");
                  reject(Error(_err));
                }
                reject(Error(err));
              });
            });
            // throw error encountered during create or find role
          }).catch(function(err) {
            console.log(err);
            reject(Error(err));
          });
        });
      }
      // throw error encountered during create or find document
    }).catch(function(err) {
      console.log(err);
      reject(Error(err));
    });
  });
};

exports.getAllDocuments = function(limit) {
  var query = {};
  if (limit) query.limit = limit;
  return new Promise(function(resolve, reject) {
    documents.findAll(query).then(function(docs) {
      resolve(docs);
    }).catch(function(err) {
      console.log("Error finding documents", err);
      reject(Error(err));
    });
  });
};

exports.getAllDocumentsByRole = function(limit, role) {
  var query = {},
    emptyRole = [],
    invalidRole = [],
    validRoleDocs = [],
    findRoles = role.split(", ");
  if (limit) query.limit = limit;
  return new Promise(function(resolve, reject) {
    findRoles.forEach(function(role, index) {
      roles.findOne({
        where: {
          rolename: role
        }
      }).then(function(_role) {
        if (!_role) {
          invalidRole.push(role);
        } else {
          _role.getDocuments(query).then(function(docs) {
            if (docs.length > 0) {
              _.forEach(docs, function(doc) {
                validRoleDocs.push(doc);
              });
            } else {
              emptyRole.push(role);
            }
            if (index === findRoles.length - 1) {
              resolve(validRoleDocs);
            }
          }).catch(function(err) {
            // console.log("Error finding documents for role", role, err);
            reject(Error(err));
          });
        }
      }).catch(function(err) {
        console.log("Error finding", role, err);
        reject(Error(err));
      });
    });
  });
};

exports.getAllDocumentsByDate = function(limit, date) {
  var query = {
    where: {
      dateCreated: {
        $lt: new Date(date),
        $gt: new Date(new Date(date) - 24 * 60 * 60 * 1000)
      }
    },
    order: [
      ['dateCreated', 'ASC']
    ]
  };
  if (limit) query.limit = limit;
  return new Promise(function(resolve, reject) {
    documents.findAll(query).then(function(docs) {
      resolve(docs);
    }).catch(function(err) {
      console.log("Error finding documents", err);
      reject(Error(err));
    });
  });
};