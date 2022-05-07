const { Client } = require('pg')

/*
Host ec2-35-168-194-15.compute-1.amazonaws.com
Database ddu8mtmnhcckms
User dmkmkgzxnctcne
Port 5432
Password 5ca25476bcbe216bffc5d370295bee62f2a7b7aab250d678de7c8b1a52e0d3c7
*/

const dbcon = new Client({
    connectionString: 'postgres://dmkmkgzxnctcne:5ca25476bcbe216bffc5d370295bee62f2a7b7aab250d678de7c8b1a52e0d3c7@ec2-35-168-194-15.compute-1.amazonaws.com:5432/ddu8mtmnhcckms',
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