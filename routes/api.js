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
      if (!req.body.title) {
        return res.status(200).send('missing required field title')
      }
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

    // GET book json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    .get(function (req, res) {
      const bookid = req.params.id;

      BookModel.findById(bookid, (err, doc) => {
        if (!doc) {
          return res.send('no book exists')
        } else {
          res.status(200).send(doc)
        }
      })
    })

    // POST a new comment, json res format like GET
    .post(function (req, res) {
      if (!req.body.comment) {
        return res.status(200).send('missing required field comment')
      }
      const bookid = req.params.id;
      const comment = req.body.comment;

      BookModel.findById(bookid, (err, doc) => {
        if (!doc) {
          return res.send('no book exists')
        } else {
          doc.comments.push(comment)
          doc.save((err, newdoc) => {
            if (err) send(err)
            res.status(200).send(newdoc)
          })
        }
      })
      // .catch(err => {
      //   res.status(500).json(err)
      // })
    })

    // DELETE a book
    .delete(function (req, res) {
      const bookid = req.params.id;

      BookModel.findByIdAndDelete(bookid, (err, doc) => {
        if (!doc) {
          return res.send('no book exists')
        } else {
          res.status(200).send('delete successful')
        }
      })

    });

};
