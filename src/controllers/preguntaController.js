const Pregunta = require('../models/preguntaModel');

// Crear pregunta
exports.createPregunta = async (req, res) => {
  try {
    const pregunta = await Pregunta.create(req.body);
    res.status(201).json(pregunta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las preguntas
exports.getPreguntas = async (req, res) => {
  try {
    const preguntas = await Pregunta.findAll();
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pregunta por ID
exports.getPreguntaById = async (req, res) => {
  try {
    const pregunta = await Pregunta.findById(req.params.id);
    if (!pregunta) return res.status(404).json({ message: 'Pregunta no encontrada' });
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar pregunta
exports.updatePregunta = async (req, res) => {
  try {
    const pregunta = await Pregunta.update(req.params.id, req.body);
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar pregunta
exports.deletePregunta = async (req, res) => {
  try {
    const pregunta = await Pregunta.delete(req.params.id);
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
