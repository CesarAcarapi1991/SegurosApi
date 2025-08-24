const express = require('express');
const router = express.Router();
const bloqueController = require('../controllers/bloqueController');

// CRUD Bloques
router.post('/', bloqueController.createBloque);       // Crear
router.get('/', bloqueController.getBloques);          // Listar todos
router.get('/:id', bloqueController.getBloqueById);    // Obtener por ID
router.put('/:id', bloqueController.updateBloque);     // Actualizar
router.delete('/:id', bloqueController.deleteBloque);  // Eliminar (marcar inactivo)

module.exports = router;
