const pool = require('../config/db');

const Producto = {
  // Crear nuevo producto
  create: async (data) => {
    const { id_seguro_empresa, producto, precio, descripcion, formato_certificado, estado = 1, usuario_creacion, empresa_id } = data;

    const query = `
      INSERT INTO producto
      (id_seguro_empresa, producto, precio, descripcion, formato_certificado, estado, usuario_creacion, empresa_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`;

    const values = [id_seguro_empresa, producto, precio, descripcion, formato_certificado, estado, usuario_creacion, empresa_id];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Obtener todos los productos activos
  findAll: async () => {
    const query = `
      SELECT *
      FROM producto
      WHERE estado = 1
      ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener producto por ID
  findById: async (id) => {
    const query = `
      SELECT *
      FROM producto
      WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Actualizar producto
  update: async (id, data) => {
    const { id_seguro_empresa, producto, precio, descripcion, formato_certificado, estado, usuario_modificacion, empresa_id } = data;

    const query = `
      UPDATE producto
      SET id_seguro_empresa=$1, producto=$2, precio=$3, descripcion=$4, formato_certificado=$5,
          estado=$6, usuario_modificacion=$7, fecha_modificacion=NOW(), empresa_id=$8
      WHERE id=$9
      RETURNING *`;

    const values = [id_seguro_empresa, producto, precio, descripcion, formato_certificado, estado, usuario_modificacion, empresa_id, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar producto (marcar como inactivo)
  delete: async (id) => {
    const query = `
      UPDATE producto
      SET estado = 0, fecha_modificacion = NOW()
      WHERE id = $1
      RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Producto;
