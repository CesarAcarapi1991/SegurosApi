const pool = require('../config/db');

const Operacion = {
  create: async (data) => {
    const {
      nro_poliza, id_cliente, id_seguro_producto, id_certificado,
      primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
      tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
      fechanacimiento, estadocivil, fechavencimiento, numerocelular,
      peso, estatura, edad, estado = 1, usuario_creacion
    } = data;

    const query = `
      INSERT INTO operacion (
        nro_poliza, id_cliente, id_seguro_producto, id_certificado,
        primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
        tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
        fechanacimiento, estadocivil, fechavencimiento, numerocelular,
        peso, estatura, edad, estado, usuario_creacion
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
      ) RETURNING *`;

    const values = [
      nro_poliza, id_cliente, id_seguro_producto, id_certificado,
      primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
      tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
      fechanacimiento, estadocivil, fechavencimiento, numerocelular,
      peso, estatura, edad, estado, usuario_creacion
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query('SELECT * FROM operacion WHERE marcabaja=false ORDER BY id');
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM operacion WHERE id=$1', [id]);
    return result.rows[0];
  },

  update: async (id, data) => {
    const {
      nro_poliza, id_cliente, id_seguro_producto, id_certificado,
      primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
      tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
      fechanacimiento, estadocivil, fechavencimiento, numerocelular,
      peso, estatura, edad, usuario_modificacion
    } = data;

    const query = `
      UPDATE operacion
      SET nro_poliza=$1, id_cliente=$2, id_seguro_producto=$3, id_certificado=$4,
          primernombre=$5, segundonombre=$6, primerapellido=$7, segundoapellido=$8, apellidocasada=$9,
          tipodocumento=$10, nrodocumento=$11, complemento=$12, extension=$13, nacionalidad=$14, ocupacion=$15,
          fechanacimiento=$16, estadocivil=$17, fechavencimiento=$18, numerocelular=$19,
          peso=$20, estatura=$21, edad=$22, usuario_modificacion=$23, fecha_modificacion = NOW()
      WHERE id=$24 RETURNING *`;

    const values = [
      nro_poliza, id_cliente, id_seguro_producto, id_certificado,
      primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
      tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
      fechanacimiento, estadocivil, fechavencimiento, numerocelular,
      peso, estatura, edad, usuario_modificacion, id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(`
      UPDATE operacion SET marcabaja=true WHERE id=$1 RETURNING *`, [id]);
    return result.rows[0];
  }
};

module.exports = Operacion;
