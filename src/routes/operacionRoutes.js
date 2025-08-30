const express = require('express');
const router = express.Router();
const operacionController = require('../controllers/operacionController');

router.post('/', operacionController.create);
router.get('/', operacionController.findAll);
router.get('/:id', operacionController.findById);
router.put('/:id', operacionController.update);
router.delete('/:id', operacionController.delete);

//filtrar la lista de operaciones
router.get("/filtrar", operacionController.findByFechaEstado);

module.exports = router;
