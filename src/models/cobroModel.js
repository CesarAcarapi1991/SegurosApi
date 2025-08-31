const pool = require('../config/db');

const Cobro = {
  // Crear cobro
  create: async (data) => {
    const { id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion } = data;
    const query = `
      INSERT INTO cobro (id_operacion, tipo_pago, monto_recibido, total, cuenta, estado, usuario_creacion)
      VALUES ($1, $2, $3, $4, $5, true, $6)
      RETURNING *`;
    const values = [id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion];
    const result = await pool.query(query, values);

    const seriesQuery = `
      SELECT *
      FROM series
      WHERE id = $1
      LIMIT 1
    `;
    const seriesResult = await pool.query(seriesQuery, [1]);
    const nro_serial = seriesResult.rows[0].nro_serial + 1;
    
    const querySeries = `
      UPDATE series
      SET nro_serial=$1
      WHERE id=1 RETURNING *`;
    const valuesSeries = [nro_serial];
    await pool.query(querySeries, valuesSeries);

    return result.rows[0];
  },
};

module.exports = Cobro;
