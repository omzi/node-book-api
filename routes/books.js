const router = require('express').Router();
const {
	getBooks,
	getBook,
	addBook,
	updateBook,
	deleteBook
} = require('../controllers/books');

const { protect, authorize } = require('../middleware/auth');


router.route('/')
	.get(getBooks)
	.post(protect, authorize('admin', 'user'), addBook)

router.route('/:id')
	.get(getBook)
	.put(protect, authorize('admin', 'user'), updateBook)
	.delete(protect, authorize('admin', 'user'), deleteBook)

module.exports = router;