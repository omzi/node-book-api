const jwt =  require('jsonwebtoken');

const getSignedWebToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

module.exports = getSignedWebToken;