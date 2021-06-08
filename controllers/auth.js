const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const loadUsers = require('../utils/loadUsers');
const saveUsers = require('../utils/saveUsers');
const sendTokenResponse = require('../utils/sendTokenResponse');
const matchPassword = require('../utils/matchPassword');
const removePrivateFields = require('../utils/removePrivateFields');


/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
	const users = loadUsers();
	const { body } = req;
  body.id = uuid.v4();

  // Create user
	try {
		const user = await User.validateAsync(body);

		const isDuplicate = users.filter(user => user.email.toLowerCase() === body.email.toLowerCase());

		if (isDuplicate.length) {
			res.status(400).json({ status: false, error: `Account with email address "${body.email}" already exists!` })
		} else {
      // Hash user password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      users.push(user); saveUsers(users);
      sendTokenResponse(user, 201, res);
		}
	} catch (error) {
    // console.log(error);
		const { details } = error;
    const message = details.map(i => i.message).join(', ');
 
   	res.status(422).json({ status: false, error: message })
	}
}


/**
 * @desc    Log user in
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
	const users = loadUsers();
	const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: false, error: 'Please enter an email address & password' })
  }

  // Check user exists
  const user = users.filter(user => user.email.toLowerCase() === email.toLowerCase());
  if (!user.length) return res.status(401).json({ status: false, error: 'Invalid credentials' })

  // Check if password matches
  const isMatch = await matchPassword(password, user[+[]].password);
  if (!isMatch) return res.status(401).json({ status: false, error: 'Invalid credentials' })

  sendTokenResponse(user[+[]], 200, res);
}


/**
 * @desc    Get current Logged in user details
 * @route   POST /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  if (req.user) {
    const user = loadUsers().find(user => user.id === req.user.id);

    res.status(200).json({ status: true, data: removePrivateFields(['password'], user) });
  } else {
    res.status(401).json({ status: false, error: 'Not authorized to access this route' })
  }
}