const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

router.post('/create', sectionController.createSection);

router.get('/:course_code', sectionController.getSectionsByCourseCode);

router.delete('/delete/:id', sectionController.deleteSection);

router.put('/update/:id', sectionController.updateSection);

module.exports = router;