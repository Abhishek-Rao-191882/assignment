import express from 'express';
import {
	addCourse,
	getCourse,
	getCourses,
	getMyCourse
} from '../controllers/course';
import { requireSignin } from '../middlewares';

const router = express.Router();

//routes
router.get('/', getCourses);
router.post('/add', requireSignin, addCourse);
router.get('/view/:id', requireSignin, getCourse);
router.get('/get-mycourse', requireSignin, getMyCourse);

module.exports = router;
