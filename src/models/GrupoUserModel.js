const { dbcon } = require("../config/connection-db");

class GrupoUser {
    constructor(id, grupo, user, mudo, admin, aceito) {
        this.id = id;
        this.grupo = grupo;
        this.user = user;
        this.mudo = mudo;
        this.admin = admin;
        this.aceito = aceito;
    }
}

// DAO = DATA ACCESS OBJECT
class GrupoUserDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM grupoUser WHERE id = $1';
        const result = await dbcon.query(sql, [id]);
        const grupoUser = result.rows[0];
        return grupoUser;
    }

    static async buscaPeloUser(user) {
        const sql = `SELECT grupo FROM grupoUser WHERE "user" = $1 AND aceito = true`;
        const result = await dbcon.query(sql, [user]);
        return result.rows;
    }

    static async buscaPeloGrupo(grupo) {
        const sql = `SELECT * FROM grupoUser WHERE grupo = $1 AND aceito = true`;
        const result = await dbcon.query(sql, [grupo]);
        return result.rows;
    }

    static async buscaPorAmbos(grupoUser) {
        const sql = `SELECT * FROM grupoUser WHERE "user" = $1 AND grupo = $2`
        const result = await dbcon.query(sql, grupoUser);
        return result.rows[0];
    }

    static async buscaPeloGrupoSemFiltro(grupo) {
        const sql = `SELECT * FROM grupoUser WHERE grupo = $1`;
        const result = await dbcon.query(sql, [grupo]);
        return result.rows;
    }

    static async encontraConvites(user) {
        const sql = `SELECT grupo, mudo, id FROM grupoUser WHERE "user" = $1 AND aceito = false;`
        const result = await dbcon.query(sql, [user]);
        return result.rows;
    }

    static async mutar(grupoUser) {
        const sql = `UPDATE grupoUser
            SET mudo = $2 
            WHERE id = $1;`;
        const values = grupoUser;
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async aceita(id) {
        const sql = "UPDATE grupoUser SET aceito = true WHERE id = $1;";

        try {
            await dbcon.query(sql, [id]);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async negar(id) {
        const sql = "DELETE FROM grupoUser WHERE id = $1";
        
        try {
            await dbcon.query(sql, [id]);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(grupoUser) {
          
        const sql = `INSERT INTO public.grupoUser(grupo,"user",mudo,"admin", aceito) VALUES ($1, $2, $3, $4, $5);`;
        const values = [grupoUser.grupo, grupoUser.user, grupoUser.mudo, grupoUser.admin, grupoUser.aceito];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }
}

module.exports = {
    GrupoUser,
    GrupoUserDAO
};