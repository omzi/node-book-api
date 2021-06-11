const router = require('express').Router();
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/auth');

const { protect } = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resetToken', resetPassword);

module.exports = router;