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

    const querySeries01 = `
      UPDATE operacion
      SET nro_poliza=$1, estado=2
      WHERE id=$2 RETURNING *`;
    const valuesSeries01 = [nro_serial, id_operacion];
    await pool.query(querySeries01, valuesSeries01);

    return result.rows[0];
  },


  findById: async (id) => {

    let query = `SELECT 
          a.*, 
          1 as cantida,
          p.producto as producto,

          CASE when c.tipo_pago = 1 THEN 'Caja: Efectivo'
               ELSE 'Debito: Cuenta Bancaria'
          END AS tipo_pago,
          c.monto_recibido,
          c.total,
          c.cuenta,
          c.fecha_creacion as fecha_cobro,
          a.nro_poliza,
          a.id_cliente,
          CASE 
            WHEN cl.tipodocumento = 1 THEN 'Carnet de Identidad'
            ELSE 'Documento Extranjero'
          END AS tipo_documento,
          COALESCE(c.primernombre, '') || ' ' || COALESCE(c.segundonombre, '') || ' ' || COALESCE(c.primerapellido, '') || ' ' || COALESCE(c.segundoapellido, '') AS nombre_completo,
          CASE
            WHEN cl.tipodocumento = 1 THEN cl.nrodocumento || ' ' || COALESCE(cl.complemento, '') || ' - ' || 
            ( CASE  
                WHEN cl.extension = 1 THEN 'LP'
                WHEN cl.extension = 2 THEN 'OR'
                WHEN cl.extension = 3 THEN 'SC'
                WHEN cl.extension = 4 THEN 'PA'
                WHEN cl.extension = 5 THEN 'BN'
                WHEN cl.extension = 6 THEN 'CO'
                WHEN cl.extension = 7 THEN 'CH'
                WHEN cl.extension = 8 THEN 'PT'
                WHEN cl.extension = 9 THEN 'TJ'
                ELSE 'QR' END 
            )
            WHEN cl.tipodocumento != 1 THEN 'E-' || cl.nrodocumento
            ELSE 'Desconocido'
          END AS nro_documento,
          cl.fechanacimiento,
          CASE 
            WHEN cl.estadocivil = 1 THEN 'Soltero(a)'
            WHEN cl.estadocivil = 2 THEN 'Casado(a)'
            WHEN cl.estadocivil = 3 THEN 'Divorciado(a)'
            WHEN cl.estadocivil = 4 THEN 'Viudo(a)'
            ELSE 'Soltero(a)'
          END AS estado_civil

        FROM cobro c
        INNER JOIN operacion a ON a.id = c.id_operacion
        INNER JOIN producto p ON p.id = a.id_seguro_producto
        INNER JOIN cliente cl ON cl.id = a.id_cliente
        WHERE a.id=$1`; 
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = Cobro;
