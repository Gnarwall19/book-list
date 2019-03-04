const express = require('express');
const router = express.Router();
/* beautify preserve:start */
var { Book } = require('../models/Book');
var { ObjectID } = require('mongodb');
//const { User } = require('../models/User');
/* beautify preserve:end */


// FRONT END RENDER
router.get('/', (req, res) => {
  Book.find().then((books) => {

    res.render('index', {
      books: books
    });
  });
});

// GET list of all DB items in JSON form
router.get('/books', (req, res) => {
  Book.find().then((books) => {
    res.send({
      books
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET single book as JSON object by id
router.get('/books/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Book.findById(id).then((book) => {
    if (!book) {
      return res.status(404).send();
    }
    res.send({
      book
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// Add a new book
router.post('/books', (req, res) => {
  let book = new Book({
    title: req.body.title,
    author: req.body.author
  });

  book.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
    throw e;
  });
});

// UPDATE list! Sets Completed to true and marks time CompletedAt
router.put('/books/:id', function (req, res) {
  const data = req.body;

  Book.updateOne({
    _id: req.params.id
  }, {
    $set: data
  }, function (err, result) {
    if (err) throw err;
    res.send('updated successfully');
  });
});

// DELETE book from DB
router.delete('/books/:id', function (req, res) {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Book.findByIdAndRemove(id).then((book) => {
    if (!book) {
      return res.status(404).send();
    }
    res.send({
      book
    });
  }).catch((e) => {
    res.status(400).send();
    throw e;
  });
});

module.exports = router;