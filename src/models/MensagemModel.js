const { sequelize } = require('../config/connection-db');
const { Model, DataTypes } = require('sequelize');

class MensagemModel extends Model {}
MensagemModel.init({
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    conteudo: DataTypes.STRING,
    autor: {
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
    data: DataTypes.DATETIME
}, { sequelize, modelName: 'mensagem' });

(async () => {
    await sequelize.sync();
})();

module.exports = { MensagemModel };
