const pool = require('../config/db');

const Pregunta = {
  // Crear nueva pregunta
  create: async (data) => {
    const { id_bloque, nro_pregunta, titulo_pregunta, tipo, estado = 1, usuario_creacion } = data;

    const query = `
      INSERT INTO pregunta (id_bloque, nro_pregunta, titulo_pregunta, tipo, estado, usuario_creacion)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;

    const values = [id_bloque, nro_pregunta, titulo_pregunta, tipo, estado, usuario_creacion];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Obtener todas las preguntas activas
  findAll: async () => {
    const query = `
      SELECT *
      FROM pregunta
      WHERE estado = 1
      ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener pregunta por ID
  findById: async (id) => {
    const query = `SELECT * FROM pregunta WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Actualizar pregunta
  update: async (id, data) => {
    const { id_bloque, nro_pregunta, titulo_pregunta, tipo, estado, usuario_creacion } = data;

    const query = `
      UPDATE pregunta
      SET id_bloque = $1, nro_pregunta = $2, titulo_pregunta = $3, tipo = $4,
          estado = $5, usuario_creacion = $6, fecha_creacion = NOW()
      WHERE id = $7
      RETURNING *`;

    const values = [id_bloque, nro_pregunta, titulo_pregunta, tipo, estado, usuario_creacion, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar pregunta (marcar como inactiva)
  delete: async (id) => {
    const query = `
      UPDATE pregunta
      SET estado = 0, fecha_creacion = NOW()
      WHERE id = $1
      RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Pregunta;
