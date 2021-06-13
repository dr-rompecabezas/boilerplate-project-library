'use strict';
const e = require('cors');
const BookModel = require('../models/book.model.js')

module.exports = function (app) {

  app.route('/api/books')
    // GET response will be array of book objects
    // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    .get(function (req, res) {

      BookModel.find((err, docs) => {
        if (err) return console.log(err)

        res.status(200).send(docs)
      })

    })

    // POST response will contain new book object including atleast _id and title
    .post(function (req, res) {
      const title = req.body.title;
      const newBook = new BookModel({ title })

      newBook.save().then(doc => {
        if (!doc || doc.length === 0) {
          return res.status(500).send(doc)
        }

        res.status(200).json({
          _id: doc._id,
          title: doc.title,
        })
      })

        .catch(err => {
          res.status(500).json(err)
        })
    })

    // DELETE, if successful, response will be 'complete delete successful'
    .delete(function (req, res) {

      BookModel.deleteMany((err, docs) => {
        if (!docs) {
          res.status(200).send('could not complete delete request')
        } else {
          res.status(200).send('complete delete successful')
        }
      })
        .catch(err => {
          res.status(500).json(err)
        })

    });



  app.route('/api/books/:id')

    // GET json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    .get(function (req, res) {
      let bookid = req.params.id;

    })

    // POST json res format same as .get
    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

    })

    // DELETE, if successful, response will be 'delete successful'
    .delete(function (req, res) {
      let bookid = req.params.id;

    });

};
