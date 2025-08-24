const pool = require('../config/db');

const Cliente = {
  // Crear nuevo cliente
  create: async (data) => {
    const {
      primernombre, segundonombre, primerapellido, segundoapellido,
      apellidocasada, tipodocumento, nrodocumento, complemento,
      extension, nacionalidad, ocupacion, fechanacimiento,
      estadocivil, fechavencimiento, numerocelular, correoelectronico, usuario
    } = data;

    const query = `
      INSERT INTO clientes 
      (primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
       tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
       fechanacimiento, estadocivil, fechavencimiento, numerocelular, correoelectronico, usuario)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *`;

    const values = [
      primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
      tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
      fechanacimiento, estadocivil, fechavencimiento, numerocelular, correoelectronico, usuario
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Obtener todos los clientes activos
  findAll: async () => {
    const query = `
      SELECT *
      FROM clientes
      WHERE marcabaja = 0
      ORDER BY codigocliente`;
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener cliente por ID
  findById: async (id) => {
    const query = `
      SELECT *
      FROM clientes
      WHERE codigocliente = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Actualizar cliente
  update: async (id, data) => {
    const {
      primernombre, segundonombre, primerapellido, segundoapellido,
      apellidocasada, tipodocumento, nrodocumento, complemento,
      extension, nacionalidad, ocupacion, fechanacimiento,
      estadocivil, fechavencimiento, numerocelular, correoelectronico, usuario
    } = data;

    const query = `
      UPDATE clientes
      SET primernombre=$1, segundonombre=$2, primerapellido=$3, segundoapellido=$4,
          apellidocasada=$5, tipodocumento=$6, nrodocumento=$7, complemento=$8, extension=$9,
          nacionalidad=$10, ocupacion=$11, fechanacimiento=$12, estadocivil=$13, fechavencimiento=$14,
          numerocelular=$15, correoelectronico=$16, usuario=$17, fecharegistro=NOW()
      WHERE codigocliente=$18
      RETURNING *`;

    const values = [
      primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
      tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
      fechanacimiento, estadocivil, fechavencimiento, numerocelular, correoelectronico, usuario, id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar cliente (marcar como baja)
  delete: async (id) => {
    const query = `
      UPDATE clientes
      SET marcabaja = 1, fecharegistro = NOW()
      WHERE codigocliente = $1
      RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Cliente;
