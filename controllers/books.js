const path = require('path');
const uuid = require('uuid');
const Book = require('../models/Book');
const loadBooks = require('../utils/loadBooks');
const saveBooks = require('../utils/saveBooks');


/**
 * @desc    Get all books
 * @route   GET /api/v1/books
 * @access  Public
 */
exports.getBooks = async (req, res, next) => {
	const books = loadBooks();

  res.status(200).json({ success: true, count: books.length, data: books });
}

/**
 * @desc    Get single book
 * @route   GET /api/v1/books/:id
 * @access  Public
 */
exports.getBook = async (req, res, next) => {
	if (!uuid.validate(req.params.id)) {
		return res.status(400).json({ success: false, error: `Invalid UUID "${req.params.id}"` })
	}
	
	const books = loadBooks();
	const bookExists = books.filter(book => book.id === req.params.id);

	if (!bookExists.length) {
		return res.status(404).json({ success: false, error: `Book not found with UUID "${req.params.id}"` })
	}

  res.status(200).json({ success: true, data: bookExists[+[]] });
}

/**s
 * @desc    Add new book
 * @route   POST /api/v1/books/
 * @access  Public
 */
exports.addBook = async (req, res, next) => {
	const books = loadBooks();
	const { body } = req;
	body.id = uuid.v4();

	try {
		const book = await Book.validateAsync(body);

		const isDuplicate = books.filter(book => {
			return book.title.toLowerCase() === body.title.toLowerCase() && book.author.toLowerCase() === body.author.toLowerCase();
		})

		if (isDuplicate.length) {
			res.status(400).json({ success: false, error: `"${body.title}" by "${body.author}" already exists!` })
		} else {
			books.push(book); saveBooks(books);
			res.status(201).json({ success: true, data: book });
		}
	} catch (error) {
		const { details } = error;
    const message = details.map(i => i.message).join(', ');
 
   	res.status(422).json({ success: false, error: message })
	}
}

/**s
 * @desc    Update book
 * @route   UPDATE /api/v1/books/:id
 * @access  Public
 */
exports.updateBook = async (req, res, next) => {
	if (!uuid.validate(req.params.id)) {
		return res.status(400).json({ success: false, error: `Invalid UUID {${req.params.id}}` })
	}

	let books = loadBooks();
	let bookIndex = books.findIndex(book => book.id.toLowerCase() === req.params.id.toLowerCase());

	if (bookIndex !== -1) {
		// Update book details...
		const newDetails = req.body;
		const privateFields = ['id'];
		const fields = Object.keys(books[bookIndex]);

		privateFields.forEach(field => delete newDetails[field]);

		Object.keys(newDetails).forEach(field => {
			if (fields.includes(field) && !privateFields.includes(field)) {
				books[bookIndex][field] = newDetails[field];
			}
		})

		saveBooks(books);
		res.status(201).json({ success: true, message: `Book with UUID "${req.params.id}" was updated successfully!` });
	} else {
		res.status(404).json({ success: false, error: `Book with UUID "${req.params.id}" not found!` });
	}
}

/**s
 * @desc    Delete book
 * @route   DELETE /api/v1/books/:id
 * @access  Public
 */
exports.deleteBook = async (req, res, next) => {
	if (!uuid.validate(req.params.id)) {
		return res.status(400).json({ success: false, error: `Invalid UUID {${req.params.id}}` })
	}

	let books = loadBooks();
	let bookIndex = books.findIndex(book => book.id.toLowerCase() === req.params.id.toLowerCase());

	if (bookIndex !== -1) {
		books.splice(bookIndex, 1), saveBooks(books);
		res.status(201).json({ success: true, message: `Book with UUID "${req.params.id}" was removed successfully!` });
	} else {
		res.status(404).json({ success: false, error: `Book with UUID "${req.params.id}" not found!` });
	}
}