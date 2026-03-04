const express = require('express');
const router = express.Router();
const definitionController = require('../controllers/definitionController');


router.get('/:course_code', definitionController.getDefinitionsByCourseCode);

router.post('/create', definitionController.createDefinition);
router.delete('/delete/:id', definitionController.deleteDefinition);

router.put('/update/:id', definitionController.updateDefinition);


module.exports = router;
