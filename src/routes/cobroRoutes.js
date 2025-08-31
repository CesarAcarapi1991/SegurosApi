const express = require('express');
const router = express.Router();
const cobroController = require('../controllers/cobroController');

router.post('/', cobroController.createCobro);
//router.get('/', cobroController.getCobro);
router.get('/:id', cobroController.getCobroById);
// router.put('/:id', empresaController.updateEmpresa);
// router.delete('/:id', empresaController.deleteEmpresa);

module.exports = router;
