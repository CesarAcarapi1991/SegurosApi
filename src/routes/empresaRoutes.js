const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

router.post('/', empresaController.createEmpresa);
router.get('/', empresaController.getEmpresas);
router.get('/:id', empresaController.getEmpresaById);
router.put('/:id', empresaController.updateEmpresa);
router.delete('/:id', empresaController.deleteEmpresa);

module.exports = router;
