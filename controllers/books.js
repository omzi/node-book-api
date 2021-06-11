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
				if (!fields.includes(field) && field !== 'id') delete book[field];
			}
		})
	}

	// Limit Fields & Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 5;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = books.length;
	const pagination = {};
	
  if (endIndex < total) (pagination.next = { page: page + 1, limit })
  if (startIndex > 0) (pagination.prev = { page: page - 1, limit })

	const result = books.slice(startIndex, endIndex);

	if (Math.floor(total / page) !== 1 && result.length) {
		res.status(200).json({ status: true, count: result.length, pagination, data: result });
	} else {
		res.status(400).json({ status: false, error: 'Invalid page or limit!', count: 0, pagination: {}, data: [] });
	}
}

/**
 * @desc    Get single book
 * @route   GET /api/v1/books/:id
 * @access  Public
 */
exports.getBook = async (req, res, next) => {
	if (!uuid.validate(req.params.id)) {
		return res.status(400).json({ status: false, error: `Invalid UUID "${req.params.id}"` })
	}
	
	const books = loadBooks();
	const bookExists = books.find(book => book.id === req.params.id);

	if (!bookExists) {
		return res.status(404).json({ status: false, error: `Book not found with UUID "${req.params.id}"` })
	}

  res.status(200).json({ status: true, data: bookExists });
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
	body.user = req.user.id;

	// Check for books posted by the current user
	const postedBooks = books.find(book => book.user === req.user.id);

	// If user is not an admin, they can only post one book
	if (postedBooks && req.user.role !== 'admin') {
		return res.status(400).json({ status: false, error: `User with ID "${req.user.id}" has already posted a book` })
	}

	try {
		const book = await Book.validateAsync(body);

		const isDuplicate = books.find(book => {
			return book.title.toLowerCase() === body.title.toLowerCase() && book.author.toLowerCase() === body.author.toLowerCase();
		})

		if (isDuplicate) {
			res.status(400).json({ status: false, error: `"${body.title}" by "${body.author}" already exists!` })
		} else {
			books.push(book), saveBooks(books);
			res.status(201).json({ status: true, data: book });
		}
	} catch (error) {
		const { details } = error;
    const message = details.map(i => i.message).join(', ');
 
   	res.status(422).json({ status: false, error: message });
	}
}

/**
 * @desc    Update book
 * @route   PUT /api/v1/books/:id
 * @access  Public
 */
exports.updateBook = async (req, res, next) => {
	if (!uuid.validate(req.params.id)) {
		return res.status(400).json({ status: false, error: `Invalid UUID "${req.params.id}"` });
	}

	let books = loadBooks();
	let bookIndex = books.findIndex(book => book.id === req.params.id);

	if (bookIndex !== -1) {
		// If user is poster or admin, allow them update the book
		if (req.user.id !== books[bookIndex].user && req.user.role !== 'admin') {
			return res.status(401).json({ status: false, error: `User with ID "${req.user.id}" is not authorized to update this book` })
		}

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

		// Validate new details against schema
		try {
			await Book.validateAsync(books[bookIndex]);

			saveBooks(books);
		} catch (error) {
			const { details } = error;
			const message = details.map(i => i.message).join(', ');
	
			return res.status(422).json({ status: false, error: message });
		}

		return res.status(200).json({ status: true, message: `Book with UUID "${req.params.id}" was updated successfully!`, data: books[bookIndex] });
	} else {
		res.status(404).json({ status: false, error: `Book with UUID "${req.params.id}" not found!` });
	}
}

/**
 * @desc    Delete book
 * @route   DELETE /api/v1/books/:id
 * @access  Public
 */
exports.deleteBook = async (req, res, next) => {
	if (!uuid.validate(req.params.id)) {
		return res.status(400).json({ status: false, error: `Invalid UUID "${req.params.id}"` }) 
	}

	let books = loadBooks();
	let bookIndex = books.findIndex(book => book.id === req.params.id);

	if (bookIndex !== -1) {
		// If user is poster or admin, allow them delete the book
		if (req.user.id !== books[bookIndex].user && req.user.role !== 'admin') {
			return res.status(401).json({ status: false, error: `User with ID "${req.user.id}" is not authorized to delete this book` })
		}
		
		books.splice(bookIndex, 1), saveBooks(books);
		res.status(200).json({ status: true, message: `Book with UUID "${req.params.id}" was removed successfully!`, data: {} });
	} else {
		res.status(404).json({ status: false, error: `Book with UUID "${req.params.id}" not found!` });
	}
}