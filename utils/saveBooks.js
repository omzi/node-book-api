const fs = require('fs');
const path = require('path');

const saveBooks = books => {
  fs.writeFileSync(path.join(path.dirname(__dirname), '.data', 'books.json'), JSON.stringify(books));
}

module.exports = saveBooks;