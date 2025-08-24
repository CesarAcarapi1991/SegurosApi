const Beneficiario = require('../models/beneficiarioModel');

exports.create = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.create(req.body);
    res.status(201).json(beneficiario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const beneficiarios = await Beneficiario.findAll();
    res.json(beneficiarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.findById(req.params.id);
    res.json(beneficiario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.update(req.params.id, req.body);
    res.json(beneficiario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.delete(req.params.id);
    res.json(beneficiario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
