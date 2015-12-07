var mockDms = require("./src/mockMthds");
var ModelFunc = require("./documentManager");

// tests for User
describe('Users', function() {
  beforeEach(function(done) {
    mockDms(done);
  });
  it('User created is unique', function() {
    // expect(user1).toBeTruthy();
    // expect(user2).toBeFalsy();
    // expect(count).tobe(2)


  });
  // it('User has a role defined', function() {
  //   // expect(user.role).toBeDefined;
  // });
  // it('User has first and last names', function() {
  //   // expect(user.firstname).toBeDefined;
  //   // expect(user.lastname).toBeDefined;
  // });
  // it('Returns all users created', function() {
  //   // expect(getAllUsers()).toEqual(jasmine.arrayContaining([]));
  // });
});

// // tests for roles
// describe('"Role"', function() {
//   it('validates role added has a unique title', function() {
//     // expect(role.unique()).toBeTruthy();
//   });
//   it('Returns all roles created', function() {
//     // expect(getAllRoles()).toEqual(jasmine.arrayContaining([]));
//   });
// });

// // tests for Document
// describe('"Document"', function() {
//   it('validates document created has a publish date', function() {
//     // expect(documentx.publishDate).toBeDefined;
//   });
//   it('Returns all document created', function() {
//     // expect(getAllDocuments()).toEqual(jasmine.arrayContaining([]));
//   });
// });

// describe('Search', function() {
//   it('Returns a specified number of ordered list by date by given role', function() {
//     // expect(getAllDocumentsByRole(role)).not.to.Equal(jasmine.arrayContaining([]));
//   });
//   it('Returns a specified number of document published on given date', function() {
//     // expect(getAllDocumentsByDate(date)).not.to.Equal(jasmine.arrayContaining([]));
//   });
// });