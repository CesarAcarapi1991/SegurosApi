const Cobro = require('../models/cobroModel');

const createCobro = async (req, res) => {
  try {
    const cobro = await Cobro.create(req.body);
    res.status(201).json(cobro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCobroById = async (req, res) => {
  try {
    const cobro = await Cobro.findById(req.params.id);
    if (!cobro) return res.status(404).json({ error: 'Cobro no encontrado' });
    res.json(cobro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCobro, getCobroById };
