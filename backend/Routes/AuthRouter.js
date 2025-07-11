const { signup, login } = require('../Controllers/AuthController');
const { signUpValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/signup', signUpValidation, signup);
router.post("/login", loginValidation, login);

module.exports = router;
// This router handles authentication-related routes such as login and signup.
