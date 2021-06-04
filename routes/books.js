const router = require('express').Router();
const {getBooks, getBook, addBook, updateBook, deleteBook} = require('../controllers/books');


router.route('/')
	.get(getBooks)
	.post(addBook)

router.route('/:id')
	.get(getBook)
	.put(updateBook)
	.delete(deleteBook)

module.exports = router;