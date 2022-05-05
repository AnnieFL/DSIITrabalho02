const { Client } = require('pg')

/*
Host ec2-35-168-194-15.compute-1.amazonaws.com
Database ddu8mtmnhcckms
User dmkmkgzxnctcne
Port 5432
Password 5ca25476bcbe216bffc5d370295bee62f2a7b7aab250d678de7c8b1a52e0d3c7
*/

const dbcon = new Client({
    connectionString: 'postgres://sychjjbxrshxxb:6d6ea63a40dd71e1a5e16d329adb85592fb897d6df80fe253809159fd538a6cc@ec2-52-71-69-66.compute-1.amazonaws.com:5432/da7gl9tj3e3hnh',
    ssl: {
        rejectUnauthorized: false
    }
});

dbcon.connect(err => {
    if (err) {
        console.log("ERRO!!! NAO FOI POSSIVEL CONECTAR NO BANCO");
        console.log( { err });
    } else {
        console.log("BANCO CONECTADO COM SUCESSO");
    }
});

module.exports = {
    dbcon
}