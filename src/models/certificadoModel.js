const pool = require('../config/db');

const Certificado = {
  create: async (data) => {
    const { id_producto, codigo, descripcion, fecha_emision, fecha_vencimiento, estado = 1, usuario_creacion } = data;

    const query = `
      INSERT INTO certificado (id_producto, codigo, descripcion, fecha_emision, fecha_vencimiento, estado, usuario_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

    const values = [id_producto, codigo, descripcion, fecha_emision, fecha_vencimiento, estado, usuario_creacion];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query('SELECT * FROM certificado WHERE estado = 1 ORDER BY id');
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM certificado WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id, data) => {
    const { codigo, descripcion, fecha_emision, fecha_vencimiento, estado, usuario_modificacion } = data;
    const query = `
      UPDATE certificado
      SET id_producto=$1, codigo=$2, descripcion=$3, fecha_emision=$4, fecha_vencimiento=$5, estado=$6, usuario_modificacion=$7, fecha_modificacion=NOW()
      WHERE id=$8 RETURNING *`;
    const values = [codigo, descripcion, fecha_emision, fecha_vencimiento, estado, usuario_modificacion, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(`
      UPDATE certificado SET estado=0, fecha_modificacion=NOW() WHERE id=$1 RETURNING *`, [id]);
    return result.rows[0];
  }
};

module.exports = Certificado;
