const router = require('express').Router();
const jwt = require('express-jwt');
const config = require('../config.json');
const controller = require('../controllers/book.controller');

module.exports = router;

const auth = jwt({
	secret: config.env.JWT_SECRET,
	userProperty: 'payload'
})

router.get('/', controller.getBooks);
router.post('/', controller.addBook);
router.put('/:bookId', controller.changeBook);
router.delete('/:bookId', controller.removeBook);
router.get('/:bookId', controller.getBook);
