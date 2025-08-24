const pool = require('../config/db');

const Certificado = {
  create: async (data) => {
    const { codigo, descripcion, fecha_emision, fecha_vencimiento, estado = 1, usuario_creacion } = data;

    const query = `
      INSERT INTO certificado (codigo, descripcion, fecha_emision, fecha_vencimiento, estado, usuario_creacion)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;

    const values = [codigo, descripcion, fecha_emision, fecha_vencimiento, estado, usuario_creacion];
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
    const { codigo, descripcion, fecha_emision, fecha_vencimiento, estado, usuario_creacion } = data;
    const query = `
      UPDATE certificado
      SET codigo=$1, descripcion=$2, fecha_emision=$3, fecha_vencimiento=$4, estado=$5, usuario_creacion=$6, fecha_creacion=NOW()
      WHERE id=$7 RETURNING *`;
    const values = [codigo, descripcion, fecha_emision, fecha_vencimiento, estado, usuario_creacion, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(`
      UPDATE certificado SET estado=0, fecha_creacion=NOW() WHERE id=$1 RETURNING *`, [id]);
    return result.rows[0];
  }
};

module.exports = Certificado;
