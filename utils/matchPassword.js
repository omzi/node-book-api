const bcrypt = require('bcryptjs');

// Match user entered password to hashed password in database
const matchPassword = (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = matchPassword;