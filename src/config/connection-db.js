const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://sychjjbxrshxxb:6d6ea63a40dd71e1a5e16d329adb85592fb897d6df80fe253809159fd538a6cc@ec2-52-71-69-66.compute-1.amazonaws.com:5432/da7gl9tj3e3hnh', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

const dbcon = () => {
    return sequelize.authenticate()
        .then(result => {
            console.log('CONECTEI')
        }).catch(error => {
            console.log("Erro ao conectar");
            console.log(error)
        })   
};

module.exports = { dbcon, sequelize };
