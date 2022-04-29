const { sequelize } = require('../config/connection-db');
const { Model, DataTypes } = require('sequelize');

class GrupoUserModel extends Model {}
GrupoUserModel.init({
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    user: {
        type: DataTypes.INTEGER,
        references: {
           model: 'user',
           key: 'id',
    }},
    grupo: {
        type: DataTypes.INTEGER,
        references: {
       model: 'grupo',
        key: 'id',
    }},
    mudo: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN
}, { sequelize, modelName: 'grupoUser' });

(async () => {
    await sequelize.sync();
})();

module.exports = { GrupoUserModel };
