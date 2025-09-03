const express = require('express');
const router = express.Router();
const beneficiarioController = require('../controllers/beneficiarioController');

router.post('/', beneficiarioController.create);
// router.get('/', beneficiarioController.findAll);
router.get('/:id', beneficiarioController.findById);
// router.put('/:id', beneficiarioController.update);
// router.delete('/:id', beneficiarioController.delete);

module.exports = router;
