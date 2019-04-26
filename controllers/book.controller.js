const db = require('../helpers/db');
const passport = require('passport');
const Book = db.Book;

module.exports = {
    getBooks: function(req, res, next) {
		passport.authenticate('jwt', { session: false }, (err, user, info)=>{
			if (err) {
				console.log("err",err)
			}
			if (user) {
					Book.find({institution: user.email.split('@')[1]}).exec()
						.then(books => {
							books = books.map(book => {
								return {
									"title": book.title,
									"author": book.author,
									"isbn": book.isbn
								}
							})
							res.status(200).json({
								count: books.length,
								books: books
							});
							next();
						})
						.catch(err => {
							console.error(err);
							res.status(500).json({ error: err });
							next();
						}) } else {
								res.status(403).json({ error: info.message });
								next()
							}
				
			})(req, res, next)
    },
    addBook: function(req, res, next) {
		passport.authenticate('jwt', { session: false }, (err, user, info)=>{
			if (err) {
				console.log("err",err)
			}
			if (user) {
				let institution = user.email.split('@')[1];
				new Book({
					title: req.body.title,
					author: req.body.author,
					isbn: req.body.isbn,
					institution, 
				}).save()
					.then(result => {
						res.status(200).json({ message: 'New book has been added', book: result });
						next();
					})
					.catch(err => {
						res.status(500).json({ error: err });
						next();
					});
			}
			else {
				res.status(403).json({ error: info.message });
				next()
			}

		})(req, res, next)

    },
    changeBook: function(req, res, next) {
        Book.findOneAndUpdate({ _id: req.params.bookId }, req.body )
            .then(result => {
                res.status(200).json({ message: 'Book has been updated', book: result })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err });
            })
    },
    removeBook: function(req, res, next) {
        Book.findByIdAndRemove({_id: req.params.bookId }).exec()
            .then(result => {
                res.status(200).json({ message: 'Book has been deleted' })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err });
            })
    },
    getBook: function(req, res, next) {
        Book.findById({ _id: req.params.bookId }).exec()
            .then(book => {
                if (book) return res.status(200).json({ message: 'Here is the book details', book: book });
                res.status(409).json({ message: 'Book not available' });
                next();
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err });
            })
    }
}