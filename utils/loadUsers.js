const fs = require('fs');
const path = require('path');

const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), '.data', 'users.json')));
  } catch (e) {
    return [];
  }
}

module.exports = loadUsers;