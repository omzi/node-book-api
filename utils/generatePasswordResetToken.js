const crypto = require('crypto');
const loadUsers = require('./loadUsers');
const saveUsers = require('./saveUsers');

const generatePasswordResetToken = userId => {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token & set to resetPasswordToken field
  // Set token expiration time to 15mins
  let users = loadUsers();
  const userIndex = users.findIndex(user => user.id === userId);

  users[userIndex].resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  users[userIndex].resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  saveUsers(users);

  return resetToken;
}

module.exports = generatePasswordResetToken;