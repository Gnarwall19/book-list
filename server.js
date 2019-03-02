const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
/* beautify preserve:start */
var { Book } = require('./models/Book');
var { ObjectID } = require('mongodb');
//const { User } = require('./models/User');
/* beautify preserve:end */

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_k4xmv49j:zeroisgoodboi69@ds157735.mlab.com:57735/heroku_k4xmv49j', {
	useNewUrlParser: true
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static("public"));


// app.use(bodyParser.json({
// 	type: 'application/*+json'
// }));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// FRONT END RENDER
app.get('/', (req, res) => {
	Book.find().then((books) => {

		res.render('index', {
			books: books
		});
	});
});

app.post('/books', (req, res) => {
	var book = new Book({
		title: req.body.title,
		author: req.body.author
	});

	book.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
		console.log(e);
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
app.delete('/books/:id', function (req, res) {
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
		console.log(book);
	}).catch((e) => {
		res.status(400).send();
		console.log(e);
	});
});


app.put('/books/:id', function (req, res) {
	const data = req.body;
	console.log(data);
	Book.updateOne({
		_id: req.params.id
	}, {
		$set: data
	}, function (err, result) {
		if (err) {
			console.log(err);
		}
		res.send('updated successfully');
	});
});



app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));

module.exports = {
	app
};