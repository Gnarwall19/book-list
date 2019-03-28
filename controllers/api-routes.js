const express = require('express');
const router = express.Router();
/* beautify preserve:start */
var { Book } = require('../models/Book');
var { ObjectID } = require('mongodb');
var { User } = require('../models/User');
var { authenticate } = require('../middleware/authenticate');
var _ = require('lodash');
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
router.get('/books', authenticate, (req, res) => {
  Book.find({
    _creator: req.user._id
  }).then((books) => {
    res.send({
      books
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET single book as JSON object by id
router.get('/books/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Book.findOne({
    _id: id,
    _creator: req.user._id
  }).then((book) => {
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
router.post('/books', authenticate, (req, res) => {
  let book = new Book({
    title: req.body.title,
    author: req.body.author,
    _creator: req.user._id
  });

  book.save().then((doc) => {
    res.send(doc);
    console.log(req.user._id);
  }, (e) => {
    res.status(400).send(e);
    throw e;
  });
});

// POST user
router.post('/users', (req, res) => {
  let user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })

  console.log(user);
});

// Authenticate users
router.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.post('/users/login', (req, res) => {
  let user = new User({
    email: req.body.email,
    password: req.body.password
  });
  console.log(user);;
  // let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(user.email, user.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// UPDATE list! Sets Completed to true and marks time CompletedAt
router.put('/books/:id', authenticate, function (req, res) {
  const data = req.body;

  Book.findOneAndUpdate({
    _id: req.params.id,
    _creator: req.user._id
  }, {
    $set: data
  }, function (err, result) {
    if (err) throw err;
    res.send('updated successfully');
  });

  // Book.updateOne({
  //   _id: req.params.id
  // }, {
  //   $set: data
  // }, function (err, result) {
  //   if (err) throw err;
  //   res.send('updated successfully');
  // });
});

// Logout user
router.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    console.log(req.token);
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

// DELETE book from DB
router.delete('/books/:id', function (req, res) {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Book.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((book) => {
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