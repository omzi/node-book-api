const getSignedWebToken = require('./getSignedWebToken');

// Create token, cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = getSignedWebToken(user.id);
  const options = {
    expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') (options.secure = true);

  res.status(statusCode)
    .cookie('token', token, options)
    .json({ status: true, token });
}

module.exports = sendTokenResponse;