const Cobro = require('../models/cobroModel');

const createCobro = async (req, res) => {
  try {
    const cobro = await Cobro.create(req.body);
    res.status(201).json(cobro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCobro };
