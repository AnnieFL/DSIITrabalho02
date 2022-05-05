const { dbcon } = require("../config/connection-db");

class Grupo {
    constructor(id, nome, imagem) {
        this.id = id;
        this.nome = nome;
        this.imagem = imagem;
    }
}

// DAO = DATA ACCESS OBJECT
class GrupoDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM grupos WHERE id = $1';
        const result = await dbcon.query(sql, [id]);
        const grupo = result.rows[0];
        return grupo;
    }

    static async atualiza(grupo) {
        const sql = `UPDATE grupos
            SET nome = $2, 
                imagem = $3,
            WHERE id = $1;`;
        const values = [grupo.id, grupo.nome, grupo.imagem];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(grupo) {
          
        const sql = 'INSERT INTO public.grupos (nome,imagem) VALUES ($1, $2);';
        const values = [grupo.nome, grupo.imagem];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }
}

module.exports = {
    Grupo,
    GrupoDAO
};