const pool = require('../config/db');
const bcrypt = require('bcrypt');

const Usuario = {
  create: async (data) => {
    const { nombre, apellido, correo, contrasena, perfil } = data;
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO usuario (nombre, apellido, correo, contrasena, perfil)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nombre, apellido, correo, hashedPassword, perfil];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query('SELECT id, nombre, apellido, correo, perfil, estado, fecha_creacion FROM usuario');
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT id, nombre, apellido, correo, perfil, estado, fecha_creacion FROM usuario WHERE id=$1', [id]);
    return result.rows[0];
  },

  update: async (id, data) => {
    const { nombre, apellido, correo, perfil, estado } = data;
    const result = await pool.query(`
      UPDATE usuario
      SET nombre=$1, apellido=$2, correo=$3, perfil=$4, estado=$5, fecha_modificacion=NOW()
      WHERE id=$6
      RETURNING *;
    `, [nombre, apellido, correo, perfil, estado, id]);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(`
      UPDATE usuario
      SET estado=false, fecha_modificacion=NOW()
      WHERE id=$1
      RETURNING *;
    `, [id]);
    return result.rows[0];
  },

  login: async (correo, contrasena) => {
    const result = await pool.query('SELECT * FROM usuario WHERE correo=$1', [correo]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const valid = await bcrypt.compare(contrasena, user.contrasena);
    if (!valid) return null;

    return user;
  }
};

module.exports = Usuario;
