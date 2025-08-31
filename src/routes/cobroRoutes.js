const express = require('express');
const router = express.Router();
const cobroController = require('../controllers/cobroController');

router.post('/', cobroController.createEmpresa);
// router.get('/', cobroController.getEmpresas);
// router.get('/:id', empresaController.getEmpresaById);
// router.put('/:id', empresaController.updateEmpresa);
// router.delete('/:id', empresaController.deleteEmpresa);

module.exports = router;
