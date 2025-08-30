const Operacion = require('../models/operacionModel');

exports.create = async (req, res) => {
  try {
    const operacion = await Operacion.create(req.body);
    res.status(201).json(operacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const operaciones = await Operacion.findAll();
    res.json(operaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const operacion = await Operacion.findById(req.params.id);
    res.json(operacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const operacion = await Operacion.update(req.params.id, req.body);
    res.json(operacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const operacion = await Operacion.delete(req.params.id);
    res.json(operacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findByFechaEstado = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta, estado } = req.query;

    // Validar que los filtros obligatorios estén presentes
    if (!fecha_desde || !fecha_hasta || !estado) {
      return res.status(400).json({ error: "fecha_desde, fecha_hasta y estado son obligatorios" });
    }

    const operaciones = await Operacion.findByFechaEstado(fecha_desde, fecha_hasta, estado);
    // res.json({
    //   success: true,
    //   count: operaciones.length,
    //   data: operaciones
    // });
    res.json(operaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};