// const Beneficiario = require('../models/beneficiarioModel');

// exports.create = async (req, res) => {
//   try {
//     const beneficiario = await Beneficiario.create(req.body);
//     res.status(201).json(beneficiario);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.findAll = async (req, res) => {
//   try {
//     const beneficiarios = await Beneficiario.findAll();
//     res.json(beneficiarios);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.findById = async (req, res) => {
//   try {
//     const beneficiario = await Beneficiario.findById(req.params.id);
//     res.json(beneficiario);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const beneficiario = await Beneficiario.update(req.params.id, req.body);
//     res.json(beneficiario);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.delete = async (req, res) => {
//   try {
//     const beneficiario = await Beneficiario.delete(req.params.id);
//     res.json(beneficiario);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const Beneficiario = require('../models/beneficiarioModel');

exports.create = async (req, res) => {
  try {
    const beneficiarios = req.body;
    if (!Array.isArray(beneficiarios)) {
      return res.status(400).json({ error: 'El body debe ser un array de beneficiarios' });
    }
    const result = await Beneficiario.create(beneficiarios);
    res.status(201).json({data: result});
  } catch (err) {
    console.error('Error al crear beneficiarios:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Buscar beneficiarios por id_operacion
 */
exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const beneficiarios = await Beneficiario.findById(id);
    if (!beneficiarios || beneficiarios.length === 0) {
      return res.status(404).json({ message: 'No se encontraron beneficiarios' });
    }
    res.json(beneficiarios);
  } catch (err) {
    console.error('Error al obtener beneficiarios:', err);
    res.status(500).json({ error: err.message });
  }
};