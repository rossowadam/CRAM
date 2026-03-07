const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const { requireAuth } = require('../middleware/auth');


router.get('/:courseCode', sectionController.getSectionsByCourseCode);

// Since all CRUD routes require Auth, run once at the top.
// If it fails, it will return 401.
// Valid auth runs next() so request is forwarded to CRUD endpoints.
router.use(requireAuth);

router.post('/create', sectionController.createSection);

router.delete('/delete/:id', sectionController.deleteSection);

router.put('/update/:id', sectionController.updateSection);

module.exports = router;