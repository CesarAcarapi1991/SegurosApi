const express = require('express');
const router = express.Router();
const preguntaController = require('../controllers/preguntaController');

// CRUD Preguntas
router.post('/', preguntaController.createPregunta);       // Crear
router.get('/', preguntaController.getPreguntas);          // Listar todos
router.get('/:id', preguntaController.getPreguntaById);    // Obtener por ID
router.put('/:id', preguntaController.updatePregunta);     // Actualizar
router.delete('/:id', preguntaController.deletePregunta);  // Eliminar (marcar inactivo)

module.exports = router;
