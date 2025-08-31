const pool = require('../config/db');

const Cobro = {
  create: async (data) => {
    const { id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion } = data;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1️⃣ Incrementar serial y obtener el nuevo número
      const serialResult = await client.query(
        `UPDATE series
         SET nro_serial = nro_serial + 1
         WHERE id = $1
         RETURNING nro_serial`,
        [1]
      );
      const serial = serialResult.rows[0].nro_serial;

      // 2️⃣ Insertar el cobro con el nro_serial como referencia
      const insertCobroQuery = `
        INSERT INTO cobro (id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const insertValues = [id_operacion, tipo_pago, monto_recibido, total, cuenta, usuario_creacion];
      const insertResult = await client.query(insertCobroQuery, insertValues);

      // 3️⃣ Actualizar la operacion con el nro_poliza generado
      await client.query(
        `UPDATE operacion
         SET nro_poliza = $1
         WHERE id = $2`,
        [serial, id_operacion]
      );

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
