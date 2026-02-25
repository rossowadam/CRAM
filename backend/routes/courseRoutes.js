const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/create', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/sample', courseController.getSampleCourses);
router.get('/:id', courseController.findCourseById);
router.put('/update/:id', courseController.updateCourse);
router.delete('/delete/:id', courseController.deleteCourse);