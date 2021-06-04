const fs = require('fs');
const path = require('path');

const loadBooks = () => {
  try {
    return JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), '.data', 'books.json')));
  } catch (e) {
    return [];
  }
}

module.exports = loadBooks;