const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const empresaRoutes = require('./routes/empresaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const bloqueRoutes = require('./routes/bloqueRoutes');
const preguntaRoutes = require('./routes/preguntaRoutes');

const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const operacionRoutes = require('./routes/operacionRoutes');
const beneficiarioRoutes = require('./routes/beneficiarioRoutes');
const certificadoRoutes = require('./routes/certificadoRoutes');

const app = express();
app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:3001'
//}));
app.use(bodyParser.json());

app.use('/api/empresas', empresaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/bloques', bloqueRoutes);
app.use('/api/preguntas', preguntaRoutes);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);

app.use('/api/operaciones', operacionRoutes);
app.use('/api/beneficiarios', beneficiarioRoutes);
app.use('/api/certificados', certificadoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
