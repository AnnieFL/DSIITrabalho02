const { sequelize } = require('../config/connection-db');
const { Model, DataTypes } = require('sequelize');

class GrupoModel extends Model {}
GrupoModel.init({
  id : {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: DataTypes.STRING,
  imagem: DataTypes.STRING
}, { sequelize, modelName: 'grupo' });

(async () => {
    await sequelize.sync();
})();

module.exports = { GrupoModel };
