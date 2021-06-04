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
	let books = loadBooks();

	// Select Fields
	if (req.query.select) {
		const fields = req.query.select.split(',');
		
		books.forEach(book => {
			for (const field in book) {
				if (!fields.includes(field)) delete book[field];
			}
		})
	}

	// Limit Fields & Pagination
	const page = parseInt(req.query.page, 10) || 1,
				limit = parseInt(req.query.limit, 10) || 5,
				startIndex = (page - 1) * limit,
				endIndex = page * limit,
				total = books.length,
				pagination = {}
	
  if (endIndex < total) (pagination.next = { page: page + 1, limit })
  if (startIndex > 0) (pagination.prev = { page: page - 1, limit })

	const result = books.slice(startIndex, endIndex);

	if (Math.floor(total / page) !== 1 && result.length) {
		res.status(200).json({ success: true, count: result.length, pagination, data: result });
	} else {
		res.status(400).json({ success: false, error: 'Invalid page or limit!', count: result.length, pagination: {}, data: result });
	}
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

/**
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

/**
 * @desc    Update book
 * @route   UPDATE /api/v1/books/:id
 * @access  Public
 */
exports.updateBook = async (req, res, next) => {
	if (!uuid.validate(req.params.id)) {
		return res.status(400).json({ success: false, error: `Invalid UUID "${req.params.id}"` });
	}

	let books = loadBooks();
	let bookIndex = books.findIndex(book => book.id.toLowerCase() === req.params.id.toLowerCase());

	if (bookIndex !== -1) {
		// Update book details...
		const newDetails = req.body;
		const immutableFields = ['id'];
		const fields = Object.keys(books[bookIndex]);

		immutableFields.forEach(field => delete newDetails[field]);

		Object.keys(newDetails).forEach(field => {
			if (fields.includes(field) && !immutableFields.includes(field)) {
				books[bookIndex][field] = newDetails[field];
			}
		})

		saveBooks(books);
		res.status(200).json({ success: true, message: `Book with UUID "${req.params.id}" was updated successfully!`, data: books[bookIndex] });
	} else {
		res.status(404).json({ success: false, error: `Book with UUID "${req.params.id}" not found!` });
	}
}

/**
 * @desc    Delete book
 * @route   DELETE /api/v1/books/:id
 * @access  Public
 */
exports.deleteBook = async (req, res, next) => {
	if (!uuid.validate(req.params.id)) {
		return res.status(400).json({ success: false, error: `Invalid UUID "${req.params.id}"` }) 
	}

	let books = loadBooks();
	let bookIndex = books.findIndex(book => book.id.toLowerCase() === req.params.id.toLowerCase());

	if (bookIndex !== -1) {
		books.splice(bookIndex, 1), saveBooks(books);
		res.status(200).json({ success: true, message: `Book with UUID "${req.params.id}" was removed successfully!`, data: {} });
	} else {
		res.status(404).json({ success: false, error: `Book with UUID "${req.params.id}" not found!` });
	}
}