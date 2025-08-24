const Certificado = require('../models/certificadoModel');

exports.create = async (req, res) => {
  try {
    const certificado = await Certificado.create(req.body);
    res.status(201).json(certificado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const certificados = await Certificado.findAll();
    res.json(certificados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const certificado = await Certificado.findById(req.params.id);
    res.json(certificado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const certificado = await Certificado.update(req.params.id, req.body);
    res.json(certificado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const certificado = await Certificado.delete(req.params.id);
    res.json(certificado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
