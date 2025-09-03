// const pool = require('../config/db');

// const Beneficiario = {
//   create: async (data) => {
//     const { id_operacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
//             parentesco, proporcion, estado = 1, usuario_creacion } = data;

//     const query = `
//       INSERT INTO beneficiario (
//         id_operacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
//         parentesco, proporcion, estado, usuario_creacion
//       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

//     const values = [id_operacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
//                     parentesco, proporcion, estado, usuario_creacion];

//     const result = await pool.query(query, values);
//     return result.rows[0];
//   },

//   findAll: async () => {
//     const result = await pool.query('SELECT * FROM beneficiario WHERE estado=1 ORDER BY id');
//     return result.rows;
//   },

//   findById: async (id) => {
//     const result = await pool.query('SELECT * FROM beneficiario WHERE id=$1', [id]);
//     return result.rows[0];
//   },

//   update: async (id, data) => {
//     const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
//             parentesco, proporcion, estado, usuario_creacion } = data;

//     const query = `
//       UPDATE beneficiario
//       SET primer_nombre=$1, segundo_nombre=$2, primer_apellido=$3, segundo_apellido=$4,
//           parentesco=$5, proporcion=$6, estado=$7, usuario_creacion=$8
//       WHERE id=$9 RETURNING *`;

//     const values = [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
//                     parentesco, proporcion, estado, usuario_creacion, id];

//     const result = await pool.query(query, values);
//     return result.rows[0];
//   },

//   delete: async (id) => {
//     const result = await pool.query('UPDATE beneficiario SET estado=0 WHERE id=$1 RETURNING *', [id]);
//     return result.rows[0];
//   }
// };

// module.exports = Beneficiario;



const pool = require('../config/db');

const Beneficiario = {
  /**
   * Crear múltiples beneficiarios
   * - Elimina (soft delete) todos los registros previos de esa operación
   * - Inserta los nuevos
   */
  create: async (beneficiarios) => {
    if (!Array.isArray(beneficiarios) || beneficiarios.length === 0) {
      throw new Error('El array de beneficiarios está vacío');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const idOperacion = beneficiarios[0].id_operacion;

      // 🔴 soft delete: desactiva todos los registros previos de esa operación
      await client.query(
        'UPDATE beneficiario SET estado=0 WHERE id_operacion=$1',
        [idOperacion]
      );

      const inserted = [];
      for (const b of beneficiarios) {
        // dividir nombre en partes
        const nombres = b.nombre.split(' ');
        const primer_nombre = nombres[0] || null;
        const segundo_nombre = nombres[1] || null;
        const primer_apellido = nombres[2] || null;
        const segundo_apellido = nombres[3] || null;

        const query = `
          INSERT INTO beneficiario (
            id_operacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
            parentesco, proporcion, estado, usuario_creacion
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,1,'system')
          RETURNING *`;

        const values = [
          b.id_operacion,
          primer_nombre,
          segundo_nombre,
          primer_apellido,
          segundo_apellido,
          b.relacion,
          b.porcentaje
        ];

        const result = await client.query(query, values);
        inserted.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return inserted;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Buscar por id_operacion con item
   */
  findById: async (id_operacion) => {
    const query = `
      SELECT 
        b.id_operacion,
        ROW_NUMBER() OVER (PARTITION BY b.id_operacion ORDER BY b.id) AS item,
        COALESCE(b.primer_nombre, '') || ' ' || COALESCE(b.segundo_nombre, '') || ' ' || COALESCE(b.primer_apellido, '') || ' ' || COALESCE(b.segundo_apellido, '') AS nombre,
        b.parentesco AS relacion,
        b.proporcion AS porcentaje
      FROM beneficiario b
      WHERE b.id_operacion = $1 AND b.estado=1
      ORDER BY b.id
    `;
    const result = await pool.query(query, [id_operacion]);
    return result.rows;
  },
};

module.exports = Beneficiario;
