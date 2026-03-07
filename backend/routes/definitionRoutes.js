const express = require('express');
const router = express.Router();
const definitionController = require('../controllers/definitionController');
const { requireAuth } = require('../middleware/auth');


router.get('/:courseCode', definitionController.getDefinitionsByCourseCode);

router.use(requireAuth);

router.post('/create', definitionController.createDefinition);
router.delete('/delete/:id', definitionController.deleteDefinition);

router.put('/update/:id', definitionController.updateDefinition);


module.exports = router;
