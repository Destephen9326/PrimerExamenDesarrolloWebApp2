// index.js
const express = require('express');
const cors = require('cors');
const Gasto = require('../backendExamenParcial/Modelos/Gasto');

const app = express();
const puerto = 5000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Api de gastos personales funcionando');
});


app.get('/gasto', async (req, res) => {
  try {
    const listaGastos = await Gasto.findAll();
    res.json(listaGastos);
  } catch (error) {
    console.log('Error en GET /gasto', error);
    res.status(500).json({ mensaje: 'Error al obtener gastos' });
  }
});


app.post('/gasto', async (req, res) => {
  try {
    const datos = req.body;


    await Gasto.create({
      categoria: datos.categoria,
      monto: datos.monto,
      fecha: datos.fecha
    });

    res.json({ mensaje: 'Gasto guardado correctamente' });
  } catch (error) {
    console.log('Error en POST /gasto', error);
    res.status(500).json({ mensaje: 'Error al guardar gasto' });
  }
});


app.listen(puerto, () => {
  console.log('Servidor iniciado en el puerto ' + puerto);
});
