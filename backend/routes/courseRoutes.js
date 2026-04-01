const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const{ registerSchema } = require('../middleware/validators/courseValidator');
const { validateAPIids } = require('../middleware/validators/apiValidator');
const { requireVerification } = require('../middleware/auth');
const { validate } = require('../middleware/validators/validationHandler');


router.post('/create', registerSchema,requireVerification,validate, courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/sample', courseController.getSampleCourses);

// vaidation middleware, prevent url injection and makes sure user is verified.
router.use('/:id', validateAPIids(), validate, requireVerification); // applies to all routes with :id param

router.get('/:id',courseController.findCourseById);
router.put('/update/:id',courseController.updateCourse);
router.delete('/delete/:id',  courseController.deleteCourse);


module.exports = router;