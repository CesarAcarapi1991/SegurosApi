const express = require('express');
const router = express.Router();
const certificadoController = require('../controllers/certificadoController');

router.post('/', certificadoController.create);
router.get('/', certificadoController.findAll);
router.get('/:id', certificadoController.findById);
router.put('/:id', certificadoController.update);
router.delete('/:id', certificadoController.delete);

module.exports = router;
