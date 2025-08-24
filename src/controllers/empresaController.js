const Empresa = require('../models/empresaModel');

const createEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.create(req.body);
    res.status(201).json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmpresaById = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.update(req.params.id, req.body);
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.delete(req.params.id);
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json({ message: 'Empresa eliminada lógicamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createEmpresa, getEmpresas, getEmpresaById, updateEmpresa, deleteEmpresa };
