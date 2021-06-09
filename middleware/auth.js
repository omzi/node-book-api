const jwt = require('jsonwebtoken');
const loadUsers = require('../utils/loadUsers');


// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.split(' ')[+[]] === 'Bearer') {
    // Set token from header
    token = req.headers.authorization.split(' ').pop();
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  } else {
    return res.status(401).json({ status: false, error: 'Not authorized to access this route' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = loadUsers().find(user => user.id === decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ status: false, error: 'Not authorized to access this route' })
  }
}

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: false, error: `User role "${req.user.role}" is not authorized to access this route` })
    }
    next();
  }
}