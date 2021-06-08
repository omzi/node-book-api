const fs = require('fs');
const path = require('path');

const saveUsers = users => {
  fs.writeFileSync(path.join(path.dirname(__dirname), '.data', 'users.json'), JSON.stringify(users));
}

module.exports = saveUsers;