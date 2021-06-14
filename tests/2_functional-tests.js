/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// Test objects supplied by responses to POST tests
let testBookId;
let testBookTitle;

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Crime and Punishment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Crime and Punishment')
            testBookId = res.body._id
            testBookTitle = res.body.title

            done()
          })
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ notitle: 'notitle' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title')

            done()
          })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');

            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/fakeid')
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')

            done()
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get(`/api/books/${testBookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isArray(res.body.comments)
            assert.property(res.body, 'commentcount');
            assert.equal(res.body.title, testBookTitle);
            assert.equal(res.body._id, testBookId);

            done()
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post(`/api/books/${testBookId}`)
          .send({ comment: 'this is a comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isArray(res.body.comments)
            assert.equal(res.body.comments[0], 'this is a comment')
            assert.property(res.body, 'commentcount');
            assert.equal(res.body.title, testBookTitle);
            assert.equal(res.body._id, testBookId);

            done()
          })
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post(`/api/books/${testBookId}`)
          .send({ nocomment: 'this comment will not be published' })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field comment')

            done()
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/fakeid')
          .send({ comment: 'this comment is for a missing book' })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')

            done()
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
        .delete(`/api/books/${testBookId}`)
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'delete successful')

          done()
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
        .delete('/api/books/fakeid')
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no book exists')

          done()
        })
      });

    });

  });

});
