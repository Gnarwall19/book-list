/* beautify preserve:start */
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Book } = require('../models/Book');
/* beautify preserve:end */

const books = [{
	_id: new ObjectID(),
	title: 'Test book',
	author: 'Michael Wolfe'
}, {
	_id: new ObjectID(),
	title: 'Test book 2'
}];



// Clear all books before running tests
// Then re-insert dummy data
beforeEach((done) => {
	Book.remove({}).then(() => {
		return Book.insertMany(books);
	}).then(() => done());
});

describe('POST /books', () => {
	it('should add a new book', (done) => {
		var title = 'Title in Test';
		var author = 'Author in Test';

		request(app)
			.post('/books')
			.send({
				title: title,
				author: author
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.title).toBe(title);
				expect(res.body.author).toBe(author);
			})
			.end((err, res) => {
				if (err) return done(err);
				Book.find({
					title,
					author
				}).then((books) => {
					expect(books.length).toBe(1);
					expect(books[0].title).toBe(title);
					expect(books[0].author).toBe(author);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create book with invalid body data', (done) => {
		request(app)
			.post('/books')
			.send({})
			// SHOULD BE 400!
			.expect(400)
			.end((err, res) => {
				if (err) return done(err);

				Book.find().then((books) => {
					expect(books.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});

});

describe('GET /books', () => {
	it('should get all books', (done) => {
		request(app)
			.get('/books')
			.expect(200)
			.expect((res) => {
				expect(res.body.books.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /books/:id', () => {
	it('should return book doc', (done) => {
		request(app)
			.get(`/books/${books[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.book.title).toBe(books[0].title);
			})
			.end(done);
	});

	// TODO: CHECK THIS! SHOLD BE GETTING 404 INSTEAD OF 400
	// it should return a 404 if book not found (done)
	// make sure you get 404 back
	it('should return 404 if book not found', (done) => {
		var hexId = new ObjectID().toHexString();
		console.log(hexId);
		request(app)
			.get(`/books/${hexId}`)
			.expect(404)
			.end(done);
	});

	// it should return 404 for non-object ids
	// /book/123 -- 404
	it('should return 404 for non-object ids', (done) => {
		request(app)
			.get('/books/notvalidid1')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /books/:id', () => {
	it('should remove a book', (done) => {
		var hexId = books[1]._id.toHexString();

		request(app)
			.delete(`/books/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.book._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Book.findById(hexId).then((book) => {
					expect(book).not.toBeTruthy();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 if book not found', (done) => {
		var hexId = new ObjectID().toHexString();

		request(app)
			.delete(`/books/${hexId}`)
			.expect(404)
			.end(done);
	});
});