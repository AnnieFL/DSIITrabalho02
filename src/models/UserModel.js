const { sequelize } = require('../config/connection-db');
const { Model, DataTypes } = require('sequelize');

class UserModel extends Model {}
UserModel.init({
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    email: DataTypes.STRING,
    nome: DataTypes.STRING,
    senha: DataTypes.STRING
}, { sequelize, modelName: 'user' });

(async () => {
    await sequelize.sync();
})();

module.exports = { UserModel };
