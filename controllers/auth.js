const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const loadUsers = require('../utils/loadUsers');
const saveUsers = require('../utils/saveUsers');
const sendTokenResponse = require('../utils/sendTokenResponse');
const matchPassword = require('../utils/matchPassword');
const removePrivateFields = require('../utils/removePrivateFields');
const generatePasswordResetToken = require('../utils/generatePasswordResetToken');
const sendEmail = require('../utils/sendEmail');


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

      // Send welcome mail
      try {
        await sendEmail({
          email: user.email,
          subject: `Welcome to the ${process.env.FROM_NAME} community!`,
          template: 'email/welcomeMessage',
          context: { 'firstName': user.firstName }
        })
      } catch (error) {
        console.log(error);
      }

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
  const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ status: false, error: 'Invalid credentials' })

  // Check if password matches
  const isMatch = await matchPassword(password, user.password);
  if (!isMatch) return res.status(401).json({ status: false, error: 'Invalid credentials' })

  sendTokenResponse(user, 200, res);
}


/**
 * @desc    Logs user out / clear cookie
 * @route   GET /api/v1/auth/logout
 * @access  Public
 */
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now()),
    httpOnly: true
  }).status(200).json({ status: true, data: {} });
}


/**
 * @desc    Get current Logged in user details
 * @route   POST /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  if (req.user) {
    const user = loadUsers().find(user => user.id === req.user.id);

    res.status(200).json({
      status: true,
      data: removePrivateFields(['password', 'resetPasswordToken', 'resetPasswordExpire'], user)
    });
  } else {
    res.status(401).json({ status: false, error: 'Not authorized to access this route' });
  }
}


/**
 * @desc    Get password reset token
 * @route   POST /api/v1/auth/forgotPassword
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  if (req.body.email) {
    const user = loadUsers().find(user => user.email === req.body.email);

    if (!user) {
      return res.status(404).json({ status: false, error: `Account with email address "${req.body.email}" does not exist` });
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken(user.id);
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    
    // Send forgot password mail
    try {
      await sendEmail({
        email: user.email,
        subject: `Password Reset Token :: ${process.env.FROM_NAME}`,
        template: 'email/forgotPassword',
        context: { 'resetURL': resetURL }
      })

      res.status(200).json({ status: true, message: 'Reset token email sent' });
    } catch (error) {
      let users = loadUsers();
      const userIndex = users.findIndex(user => user.id === userId);

      users[userIndex].resetPasswordToken = undefined;
      users[userIndex].resetPasswordExpire = undefined;
      saveUsers(users);

      res.status(500).json({ status: false, error: 'Reset token email could not be sent' });
    }
  } else {
    res.status(400).json({ status: false, error: 'Please enter your email address' });
  }
}


/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/resetPassword/:resetToken
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  const users = loadUsers();
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const user = users.find(user => {
    return user.resetPasswordToken === resetPasswordToken && user.resetPasswordExpire > Date.now()
  });

  if (!user) return res.status(400).json({ status: false, error: 'Invalid reset token' });
  const userIndex = users.findIndex(_user => _user.id === user.id);

  try {
    user.password = req.body.password;
    await User.validateAsync(user);

    // Hash & save user password
    const salt = await bcrypt.genSalt(10);
    users[userIndex].password = await bcrypt.hash(user.password, salt);
    users[userIndex].resetPasswordToken = undefined;
    users[userIndex].resetPasswordExpire = undefined;
    saveUsers(users);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    const { details } = error;
    const message = details.map(i => i.message).join(', ');

    return res.status(422).json({ status: false, error: message });
  }
}