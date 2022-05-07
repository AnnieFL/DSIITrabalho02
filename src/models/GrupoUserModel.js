const { dbcon } = require("../config/connection-db");

class GrupoUser {
    constructor(id, grupo, user, mudo, admin) {
        this.id = id;
        this.grupo = grupo;
        this.user = user;
        this.mudo = mudo;
        this.admin = admin;
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
        const sql = `SELECT grupo FROM grupoUser WHERE "user" = $1`;
        const result = await dbcon.query(sql, [user]);
        return result.rows;
    }

    static async atualiza(grupoUser) {
        const sql = `UPDATE grupoUser
            SET mudo = $2 
            WHERE id = $1;`;
        const values = [grupoUser.id, grupoUser.mudo];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(grupoUser) {
          
        const sql = `INSERT INTO public.grupoUser(grupo,"user",mudo,"admin") VALUES ($1, $2, $3, $4);`;
        const values = [grupoUser.grupo, grupoUser.user, grupoUser.mudo, grupoUser.admin];
        
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