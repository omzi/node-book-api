const express = require('express');
const colors = require('colors');


// Loads .env file from root directly
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const books = require('./routes/books');
app.use('/api/v1/books', books);

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