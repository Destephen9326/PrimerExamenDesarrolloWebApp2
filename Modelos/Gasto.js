// modelos/Gasto.js
const { DataTypes } = require('sequelize');
const bd = require('../db/connection');



const Gasto = bd.define('gasto', {
  idgasto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'gasto',
  timestamps: false
});


module.exports = Gasto;
