const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
/* beautify preserve:start */
var { Book } = require('./models/Book');
var { ObjectID } = require('mongodb');
//const { User } = require('./models/User');
/* beautify preserve:end */

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/BookList');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/books', (req, res) => {
	var book = new Book({
		title: req.body.title,
		author: req.body.author
	});

	book.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/books', (req, res) => {
	Book.find().then((books) => {
		res.send({
			books
		});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/books/:id', (req, res) => {
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

// DELETE
app.delete('/books/:id', (req, res) => {
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
	});
});




app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));

module.exports = {
	app
};