/**
 * @desc    Get all books
 * @route   GET /api/v1/books
 * @access  Public
 */
exports.getBooks = async (req, res, next) => {
  res.status(200).json({ success: true, data: {} });
}

/**
 * @desc    Get single book
 * @route   GET /api/v1/books/:id
 * @access  Public
 */
exports.getBook = async (req, res, next) => {
  res.status(200).json({ success: true, data: {} });
}

/**s
 * @desc    Add new book
 * @route   POST /api/v1/books/
 * @access  Private
 */
exports.addBook = async (req, res, next) => {
  res.status(201).json({ success: true, data: {} });
}

/**s
 * @desc    Update book
 * @route   UPDATE /api/v1/books/:id
 * @access  Public
 */
exports.updateBook = async (req, res, next) => {
  res.status(201).json({ success: true, data: {} });
}

/**s
 * @desc    Delete book
 * @route   DELETE /api/v1/books/
 * @access  Public
 */
exports.deleteBook = async (req, res, next) => {
  res.status(201).json({ success: true, data: {} });
}