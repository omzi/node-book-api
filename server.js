const express = require('express');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');


// Loads .env file from root directory
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Security features
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 5,
	handler: (req, res) => {
		res.status(429).json({ status: false, error: 'Too many requests. Please try again later.' });
	}
})
app.use(helmet()); // Adds security headers
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP param pollution
app.use(cors()) // Enable CORS
app.use('/api/', limiter); // API rate limiting


const books = require('./routes/books');
const users = require('./routes/users');
const auth = require('./routes/auth');

app.use('/api/v1/books', books);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

// Dev logging
process.env.NODE_ENV !== 'production' && app.use(require('morgan')('dev'));


const PORT = process.env.PORT || 2021

const server = app.listen(PORT, () => {
  console.log(':>>'.green.bold, 'Server running in'.yellow.bold,  process.env.NODE_ENV.toUpperCase().blue.bold, 'mode, on port'.yellow.bold, `${PORT}`.blue.bold)
})


// 'Handle' unhandled promise rejections
process.on('unhandledRejection', err => {
	console.log(`✖ | Error: ${err.message}`.red.bold)
	server.close(() => process.exit(1))
})