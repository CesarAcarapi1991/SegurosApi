const pool = require('../config/db');

const Operacion = {
  create: async (data) => {
    const {
      nro_poliza, id_cliente, id_seguro_producto,
      peso, estatura, estado = 1, usuario_creacion
    } = data;

    // 1. Buscar el certificado según el producto
    const certificadoQuery = `
    SELECT id
    FROM certificado
    WHERE id_producto = $1
    LIMIT 1
  `;
    const certificadoResult = await pool.query(certificadoQuery, [id_seguro_producto]);

    if (certificadoResult.rows.length === 0) {
      throw new Error("No se encontró certificado para el producto seleccionado");
    }

    // Declarar y asignar id_certificado
    const id_certificado = certificadoResult.rows[0].id;

    // 2. Buscar el cliente
    const clienteQuery = `
    SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, fechanacimiento)) AS edad, *
    FROM clientes
    WHERE codigocliente = $1
    LIMIT 1
  `;
    const clienteResult = await pool.query(clienteQuery, [id_cliente]);

    if (clienteResult.rows.length === 0) {
      throw new Error("No se encontró cliente seleccionado");
    }

    // 2. Buscar el producto para obtener el precio
    const productoQuery = `
      SELECT *
      FROM producto
      WHERE id = $1
      LIMIT 1
    `;
    const productoResult = await pool.query(productoQuery, [id_seguro_producto]);

    if (productoResult.rows.length === 0) {
      throw new Error("No se encontró cliente seleccionado");
    }

    const primernombre = clienteResult.rows[0].primernombre;
    const segundonombre = clienteResult.rows[0].segundonombre;
    const primerapellido = clienteResult.rows[0].primerapellido;
    const segundoapellido = clienteResult.rows[0].segundoapellido;
    const apellidocasada = clienteResult.rows[0].apellidocasada;
    const tipodocumento = clienteResult.rows[0].tipodocumento;
    const nrodocumento = clienteResult.rows[0].nrodocumento;
    const complemento = clienteResult.rows[0].complemento;
    const extension = clienteResult.rows[0].extension;
    const nacionalidad = clienteResult.rows[0].nacionalidad;
    const ocupacion = clienteResult.rows[0].ocupacion;
    const fechanacimiento = clienteResult.rows[0].fechanacimiento;
    const estadocivil = clienteResult.rows[0].estadocivil;
    const fechavencimiento = clienteResult.rows[0].fechavencimiento;
    const numerocelular = clienteResult.rows[0].numerocelular;
    const correoelectronico = clienteResult.rows[0].correoelectronico;
    const edad = clienteResult.rows[0].edad;
    const precio = productoResult.rows[0].precio;

    // 2. Insertar en operacion
    const query = `
    INSERT INTO operacion (
      nro_poliza, id_cliente, id_seguro_producto, id_certificado,
      primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
      tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
      fechanacimiento, estadocivil, fechavencimiento, numerocelular, correoelectronico,
      peso, estatura, edad, estado, usuario_creacion, precio
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26
    ) RETURNING *;
  `;

    const values = [
      nro_poliza, id_cliente, id_seguro_producto, id_certificado,
      primernombre, segundonombre, primerapellido, segundoapellido, apellidocasada,
      tipodocumento, nrodocumento, complemento, extension, nacionalidad, ocupacion,
      fechanacimiento, estadocivil, fechavencimiento, numerocelular, correoelectronico,
      peso, estatura, edad, estado, usuario_creacion, precio
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },


  findAll: async () => {
    const result = await pool.query('SELECT * FROM operacion WHERE marcabaja=false ORDER BY id');
    return result.rows;
  },

  findById: async (id) => {

    let query = `SELECT a.*, 
        1 as cantida,
        p.producto as producto
        FROM operacion a
        INNER JOIN producto p ON p.id = a.id_seguro_producto
        WHERE a.id=$1`; 
    const result = await pool.query(query, [id]);
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
  },

  findByFechaEstado: async (fecha_desde, fecha_hasta, estado) => {
    // Query inicial
    let query = `
      SELECT 
        a.id,
        a.nro_poliza,
        a.id_cliente,
        CASE 
          WHEN c.tipodocumento = 1 THEN 'Carnet de Identidad'
          ELSE 'Documento Extranjero'
        END AS tipo_documento,
        COALESCE(c.primernombre, '') || ' ' || COALESCE(c.segundonombre, '') || ' ' || COALESCE(c.primerapellido, '') || ' ' || COALESCE(c.segundoapellido, '') AS nombre_completo,
        CASE
          WHEN c.tipodocumento = 1 THEN c.nrodocumento || ' ' || COALESCE(c.complemento, '') || ' - ' || 
		      ( CASE  
              WHEN c.extension = 1 THEN 'LP'
              WHEN c.extension = 2 THEN 'OR'
              WHEN c.extension = 3 THEN 'SC'
              WHEN c.extension = 4 THEN 'PA'
              WHEN c.extension = 5 THEN 'BN'
              WHEN c.extension = 6 THEN 'CO'
              WHEN c.extension = 7 THEN 'CH'
              WHEN c.extension = 8 THEN 'PT'
              WHEN c.extension = 9 THEN 'TJ'
              ELSE 'QR' END 
          )
          WHEN c.tipodocumento != 1 THEN 'E-' || c.nrodocumento
          ELSE 'Desconocido'
        END AS nro_documento,
        c.fechanacimiento,
        CASE 
          WHEN c.estadocivil = 1 THEN 'Soltero(a)'
          WHEN c.estadocivil = 2 THEN 'Casado(a)'
          WHEN c.estadocivil = 3 THEN 'Divorciado(a)'
          WHEN c.estadocivil = 4 THEN 'Viudo(a)'
          ELSE 'Soltero(a)'
        END AS estado_civil,
        a.fecha_creacion,
        a.id_seguro_producto,
        CASE
          WHEN a.estado = 1 THEN 'Generado'
          WHEN a.estado = 2 THEN 'Vigente'
          ELSE 'Desconocido'
        END AS estado,
        p.producto,
        CASE WHEN a.estado = 1 THEN 'S/D' ELSE a.fecha_creacion||'' END as fechavigencia,
      a.precio,
      e.nombre AS empresa,
      a.estado

      FROM operacion a
      INNER JOIN clientes c ON a.id_cliente = c.codigocliente
      INNER JOIN producto p ON a.id_seguro_producto = p.id
      INNER JOIN empresa_aseguradora e ON p.empresa_id = e.id
      WHERE a.fecha_creacion BETWEEN $1::date AND ($2::date + INTERVAL '1 day' - INTERVAL '1 millisecond') 
    `;

    if (estado != 0) {
      query += ' AND a.estado = $3';
    }

    query += ' ORDER BY id';

    const values = [fecha_desde, fecha_hasta];
    if (estado != 0) values.push(estado);

    const result = await pool.query(query, values);
    return result.rows;
  },

};

module.exports = Operacion;
