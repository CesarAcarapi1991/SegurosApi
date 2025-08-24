const pool = require('../config/db');

const Producto = {
  // Crear nuevo producto
  create: async (data) => {
    const { 
      empresa_id, 
      producto, 
      precio, 
      descripcion, 
      formato_certificado, 
      edad_minima, 
      edad_maxima,
      cantidad_beneficiario, 
      estado = 1, 
      usuario_creacion 
    } = data;

    const query = `
      INSERT INTO producto
      (empresa_id, producto, precio, descripcion, formato_certificado, edad_minima, edad_maxima, cantidad_beneficiario, estado, usuario_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;

    const values = [
      empresa_id, 
      producto, 
      precio, 
      descripcion, 
      formato_certificado, 
      edad_minima, 
      edad_maxima, 
      cantidad_beneficiario,
      estado, 
      usuario_creacion
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Obtener todos los productos activos
  findAll: async () => {
    const query = `
      SELECT p.*, ea.nombre as nombre_empresa
      FROM producto p
      INNER JOIN empresa_aseguradora ea ON p.empresa_id = ea.id
      WHERE p.estado = 1
      ORDER BY p.id`;
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener producto por ID
  findById: async (id) => {
    const query = `
      SELECT p.*, ea.nombre as nombre_empresa
      FROM producto p
      INNER JOIN empresa_aseguradora ea ON p.empresa_id = ea.id
      WHERE p.id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Obtener productos por empresa
  findByEmpresa: async (empresa_id) => {
    const query = `
      SELECT p.*, ea.nombre as nombre_empresa
      FROM producto p
      INNER JOIN empresa_aseguradora ea ON p.empresa_id = ea.id
      WHERE p.empresa_id = $1 AND p.estado = 1
      ORDER BY p.producto`;
    const result = await pool.query(query, [empresa_id]);
    return result.rows;
  },

  // Actualizar producto
  update: async (id, data) => {
    const { 
      empresa_id, 
      producto, 
      precio, 
      descripcion, 
      formato_certificado, 
      edad_minima, 
      edad_maxima, 
      cantidad_beneficiario,
      estado, 
      usuario_modificacion 
    } = data;

    const query = `
      UPDATE producto
      SET empresa_id=$1, producto=$2, precio=$3, descripcion=$4, formato_certificado=$5,
          edad_minima=$6, edad_maxima=$7, cantidad_beneficiario=$8, estado=$9, usuario_modificacion=$10, fecha_modificacion=NOW()
      WHERE id=$10
      RETURNING *`;

    const values = [
      empresa_id, 
      producto, 
      precio, 
      descripcion, 
      formato_certificado, 
      edad_minima, 
      edad_maxima, 
      cantidad_beneficiario,
      estado, 
      usuario_modificacion, 
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar producto (marcar como inactivo)
  delete: async (id, usuario_modificacion = null) => {
    const query = `
      UPDATE producto
      SET estado = 0, fecha_modificacion = NOW(), usuario_modificacion = $2
      WHERE id = $1
      RETURNING *`;
    const result = await pool.query(query, [id, usuario_modificacion]);
    return result.rows[0];
  }
};

module.exports = Producto;