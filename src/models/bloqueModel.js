const pool = require('../config/db');

const Bloque = {
  // Crear nuevo bloque
  create: async (data) => {
    const { id_producto, nro_bloque, titulo_bloque, estado = 1, usuario_creacion } = data;

    const query = `
      INSERT INTO bloque (id_producto, nro_bloque, titulo_bloque, estado, usuario_creacion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;

    const values = [id_producto, nro_bloque, titulo_bloque, estado, usuario_creacion];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Obtener todos los bloques activos
  findAll: async () => {
    const query = `
      SELECT *
      FROM bloque
      WHERE estado = 1
      ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener bloque por ID
  findById: async (id) => {
    const query = `
      SELECT *
      FROM bloque
      WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Actualizar bloque
  update: async (id, data) => {
    const { id_producto, nro_bloque, titulo_bloque, estado, usuario_creacion } = data;

    const query = `
      UPDATE bloque
      SET id_producto = $1, nro_bloque = $2, titulo_bloque = $3,
          estado = $4, usuario_creacion = $5, fecha_creacion = NOW()
      WHERE id = $6
      RETURNING *`;

    const values = [id_producto, nro_bloque, titulo_bloque, estado, usuario_creacion, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar bloque (marcar como inactivo)
  delete: async (id) => {
    const query = `
      UPDATE bloque
      SET estado = 0, fecha_creacion = NOW()
      WHERE id = $1
      RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Bloque;
