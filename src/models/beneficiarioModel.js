const pool = require('../config/db');

const Beneficiario = {
  create: async (data) => {
    const { id_operacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
            parentesco, proporcion, estado = 1, usuario_creacion } = data;

    const query = `
      INSERT INTO beneficiario (
        id_operacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        parentesco, proporcion, estado, usuario_creacion
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

    const values = [id_operacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                    parentesco, proporcion, estado, usuario_creacion];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query('SELECT * FROM beneficiario WHERE estado=1 ORDER BY id');
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM beneficiario WHERE id=$1', [id]);
    return result.rows[0];
  },

  update: async (id, data) => {
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
            parentesco, proporcion, estado, usuario_creacion } = data;

    const query = `
      UPDATE beneficiario
      SET primer_nombre=$1, segundo_nombre=$2, primer_apellido=$3, segundo_apellido=$4,
          parentesco=$5, proporcion=$6, estado=$7, usuario_creacion=$8
      WHERE id=$9 RETURNING *`;

    const values = [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                    parentesco, proporcion, estado, usuario_creacion, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('UPDATE beneficiario SET estado=0 WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Beneficiario;
