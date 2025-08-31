const pool = require('../config/db');

const Cobro = {
  create: async (data) => {
    const { id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion } = data;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1️⃣ Insertar cobro
      const insertQuery = `
        INSERT INTO cobro (id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const insertValues = [id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion];
      const insertResult = await client.query(insertQuery, insertValues);

      const serialQuery = `
        SELECT nro_serial
        FROM series
        WHERE id = $1
        LIMIT 1
      `;
      const serialResult = await pool.query(serialQuery, 1);
      const serial = serialResult.rows[0].nro_serial + 1;

      // 2️⃣ Primer update (ejemplo: actualizar estado de operacion)
      const update1Query = `UPDATE series SET nro_serial = $1 WHERE id = $2`;
      await client.query(update1Query, [serial, 1]);

      // 3️⃣ Segundo update (ejemplo: actualizar otra tabla relacionada)
      const update2Query = `UPDATE operacion SET nro_poliza = $1 WHERE id_operacion = $2`;
      await client.query(update2Query, [serial, id_operacion]);

      await client.query('COMMIT');
      return insertResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};



module.exports = Cobro;
