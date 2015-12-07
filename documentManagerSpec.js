var mockDms = require("./src/mockMthds");
var ModelFunc = require("./documentManager");
var _ = require("lodash");

function isStringLen(args) {
  return _.every(args, function(arg) {
    return typeof arg === 'string' && arg.length > 0;
  });
}

function isDate(args) {
  return _.every(args, function(arg) {
    return new Date(arg) instanceof Date;
  });
}
describe('CRUD operations in database', function() {
  var roles, users, docs, userTest;
  beforeEach(function(done) {
    mockDms.populateMock(function(result) {
      roles = result[0];
      users = result[1];
      docs = result[2];
      var userAttr = ["firstname", "lastname", "username", "rolename", "email"];
      var docAttr = ["userid", "documentName", "title", "content", "dateCreated"];
      var mapUser = _.map(userAttr, function(attr) {
        return _.pluck(users, attr);
      });
      var mapDoc = _.map(docAttr, function(attr) {
        return _.pluck(docs, attr);
      });
      userTest = _.zipObject(userAttr, mapUser);
      docTest = _.zipObject(docAttr, mapDoc);
      done();
    });
  });
  afterEach(function(done) {
      mockDms.deleteModels(done);
    })
    // tests for User
  describe('Users', function(done) {
    it('User created is unique - username, email', function(done) {
      expect(userTest.username).toBeDefined;
      expect(userTest.username).toEqual(["EAbbott", "DAdams", "HAhmed"]);
      expect(userTest.username).toEqual(_.uniq(userTest.username));
      expect(userTest.email).toEqual(_.uniq(userTest.email));
      done();
    });

    it('User has a role defined', function(done) {
      expect(userTest.rolename).toBeDefined;
      expect(userTest.rolename).toEqual(["Admin", "Scientist", "Writer"]);
      expect(userTest.rolename.length).toEqual(3);
      done();
    });

    it('User has first and last names', function(done) {
      expect(userTest.firstname).toBeDefined;
      expect(userTest.firstname.length).toEqual(3);
      expect(isStringLen(userTest.firstname)).toBeTruthy();
      expect(userTest.lastname).toBeDefined;
      expect(userTest.lastname.length).toEqual(3);
      expect(isStringLen(userTest.lastname)).toBeTruthy();
      done();
    });

    it('Returns all users created', function(done) {
      ModelFunc.users.getAllUsers().then(function(users) {
        var allUsers = mockDms.strip(users);
        expect(allUsers.length).toEqual(3);
        expect(allUsers[0]).toEqual(jasmine.objectContaining({
          userid: 1,
          username: 'EAbbott',
          email: 'eabbott@write.com',
          rolename: 'Admin'
        }));
        done();
      });
    });

  });

  // tests for roles
  describe('"Role"', function(done) {
    it('validates role added has a unique title', function(done) {
      expect(userTest.rolename).toBeDefined;
      expect(userTest.rolename).toEqual(["Admin", "Scientist", "Writer"]);
      expect(userTest.rolename.length).toEqual(3);
      expect(userTest.rolename).toEqual(_.uniq(userTest.rolename));
      done();
    });

    it('Returns all roles created', function(done) {
      ModelFunc.roles.getAllRoles().then(function(roles) {
        var allRoles = mockDms.strip(roles);
        expect(allRoles.length).toEqual(3);
        expect(allRoles[0]).toEqual(jasmine.objectContaining({
          roleId: 1,
          rolename: 'Admin'
        }));
        done();
      });
    });
  });

  // tests for Document
  describe('"Document"', function() {
    it('validates document created has a publish date', function() {
      expect(docTest.dateCreated).toBeDefined;
      expect(docTest.dateCreated.length).toEqual(6);
      expect(isDate(docTest.dateCreated)).toBeTruthy();
    });

    it('Returns all document created', function(done) {
      ModelFunc.docs.getAllDocuments().then(function(docs) {
        var allDocs = mockDms.strip(docs);
        expect(allDocs.length).toEqual(6);
        expect(allDocs[0]).toEqual(jasmine.objectContaining({
          documentId: 1,
          documentName: 'Lorems',
          title: 'LOREM IPSUM',
          content: 'Who knows the whole words....'
        }));
        done();
      });
    });
  });

  describe('Search', function(done) {
    it('Returns a specified number of ordered list by date by given role', function(done) {
      ModelFunc.docs.getAllDocumentsByRole(2, "Scientist").then(function(docs) {
        var allDocs = mockDms.strip(docs);
        expect(allDocs.length).toEqual(2);
        expect(/Writer/.test(JSON.stringify(allDocs))).toBeFalsy();
        done();
      });
    });

    it('Returns a specified number of document published on given date', function(done) {
      ModelFunc.docs.getAllDocumentsByDate(3, Date.now()).then(function(docs) {
        var allDocs = mockDms.strip(docs);
        expect(allDocs.length).toEqual(3);
        expect(allDocs[0].dateCreated < allDocs[1].dateCreated).toBeTruthy();
        done();
      });
    });
  });

});