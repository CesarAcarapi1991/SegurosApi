const Bloque = require('../models/bloqueModel');

// Crear un nuevo bloque
exports.createBloque = async (req, res) => {
  try {
    const bloque = await Bloque.create(req.body);
    res.status(201).json(bloque);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los bloques
exports.getBloques = async (req, res) => {
  try {
    const bloques = await Bloque.findAll();
    res.json(bloques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener bloque por ID
exports.getBloqueById = async (req, res) => {
  try {
    const bloque = await Bloque.findById(req.params.id);
    if (!bloque) return res.status(404).json({ message: 'Bloque no encontrado' });
    res.json(bloque);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar bloque
exports.updateBloque = async (req, res) => {
  try {
    const bloque = await Bloque.update(req.params.id, req.body);
    res.json(bloque);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar bloque
exports.deleteBloque = async (req, res) => {
  try {
    const bloque = await Bloque.delete(req.params.id);
    res.json(bloque);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
