import express from 'express';
//controllers
import {
	currentUser,
	forgotPassword,
	resetPassword,
	login,
	logout,
	register,
	enrollMe,
} from '../controllers/auth';
//middlewares
import { requireSignin } from '../middlewares';

const router = express.Router();

//routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/current-user', requireSignin, currentUser);
router.post('/enrollme', enrollMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
