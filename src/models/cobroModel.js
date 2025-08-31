const pool = require('../config/db');

const Cobro = {
  create: async (data) => {
    const { id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion } = data;

    const query = `
      INSERT INTO cobro (id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion];

    const result = await pool.query(query, values);
    return result.rows[0];
  },
};


module.exports = Cobro;
