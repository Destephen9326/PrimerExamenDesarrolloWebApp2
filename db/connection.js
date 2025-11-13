// db/conexion.js
const { Sequelize } = require('sequelize');

const bd = new Sequelize('exameniparcial', 'root', '199326@', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306
});


bd.authenticate()
  .then(() => {
    console.log('Conexion a la base de datos OK');
  })
  .catch((error) => {
    console.log('Error al conectar base de datos');
    console.log(error);
  });

module.exports = bd;
