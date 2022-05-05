class Mensagem {
    constructor(id, conteudo, autor, grupo, data) {
        this.id = id;
        this.conteudo = conteudo;
        this.autor = autor;
        this.grupo = grupo;
        this.data = data;
    }
}

// DAO = DATA ACCESS OBJECT
class MensagemDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM mensagens WHERE id = $1';
        const result = await dbcon.query(sql, [id]);
        const grupo = result.rows[0];
        return grupo;
    }

    static async atualiza(mensagen) {
        const sql = `UPDATE mensagens
            SET conteudo = $2, 
                autor = $3,
                grupo = $4,
                data = $5
            WHERE id = $1;`;
        const values = [mensagem.id, mensagem.conteudo, mensagem.autor, mensagem.grupo, mensagem.data];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(mensagem) {
          
        const sql = 'INSERT INTO public.mensagens (conteudo, autor, grupo, data) VALUES ($1, $2, $3, $4);';
        const values = [mensagem.conteudo, mensagem.autor, mensagem.grupo, mensagem.data];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }
}

module.exports = {
    Mensagem,
    MensagemDAO
};
