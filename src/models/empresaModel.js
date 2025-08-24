const pool = require('../config/db');

const Empresa = {
  // Crear nueva empresa
  create: async (data) => {
    const { nombre, descripcion, usuario_creacion } = data;
    const query = `
      INSERT INTO empresa_aseguradora (nombre, descripcion, usuario_creacion)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [nombre, descripcion, usuario_creacion];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Obtener todas las empresas activas
  findAll: async () => {
    const query = `
      SELECT *
      FROM empresa_aseguradora
      WHERE marcabaja = FALSE
      ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener empresa por ID
  findById: async (id) => {
    const query = `
      SELECT *
      FROM empresa_aseguradora
      WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Actualizar empresa
  update: async (id, data) => {
    const { nombre, descripcion, usuario_modificacion } = data;
    const query = `
      UPDATE empresa_aseguradora
      SET nombre = $1,
          descripcion = $2,
          usuario_modificacion = $3,
          fecha_modificacion = NOW()
      WHERE id = $4
      RETURNING *`;
    const values = [nombre, descripcion, usuario_modificacion, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar (marcar como baja) empresa
  delete: async (id) => {
    const query = `
      UPDATE empresa_aseguradora
      SET marcabaja = TRUE,
          fecha_modificacion = NOW()
      WHERE id = $1
      RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Empresa;
