const { dbcon } = require("../config/connection-db");

class User {
    constructor(id, email, nome, senha) {
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.senha = senha;
    }
}

// DAO = DATA ACCESS OBJECT
class UserDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM users WHERE id = $1';
        const result = await dbcon.query(sql, [id]);
        const user = result.rows[0];
        return user;
    }

    static async buscaPelosIds(ids) {
        const users = [];
        let results = null;
        for (let i=0; i<ids.length; i++) {
            const sql = 'SELECT * FROM users WHERE id = $1';
            results = await dbcon.query(sql, [ids[i].user]);
            users.push(results.rows[0]);
        }
        return users;
    }

    static async buscaPeloEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = $1';
        const result = await dbcon.query(sql, [email]);
        const user = result.rows[0];
        return user;
    }

    static async buscaTodosMenos(ids) {
        const users = [];
        let sql = 'SELECT * FROM users WHERE id NOT IN (';
        for (let i =0; i<ids.length; i++) {
            
            users.push(ids[i].user);
            sql += '$'+(i+1);
            if (i != ids.length-1) {
                sql += ", ";
            }
        }
        sql += ");";
        const results = await dbcon.query(sql, users);
        return results.rows;
    }

    static async buscaTodosMenosWhere(ids) {
        const users = [];
        let sql = 'SELECT * FROM users WHERE id NOT IN (';
        for (let i =0; i<ids[0].length; i++) {
            
            users.push(ids[0][i].user);
            sql += '$'+(i+1);
            if (i != ids[0].length-1) {
                sql += ", ";
            }
        }
        sql += ") AND (nome like '%"+ids[1]+"%' OR email like '%"+ids[1]+"%');";
        const results = await dbcon.query(sql, users);
        return results.rows;
    }

    static async atualiza(user) {
        const sql = `UPDATE users
            SET email = $2, 
                nome = $3,
                senha = $4
            WHERE id = $1;`;
        const values = [user.id, user.email, user.nome, user.senha];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(user) {
          
        const sql = 'INSERT INTO public.users (email, nome, senha) VALUES ($1, $2, $3);';
        const values = [user.email, user.nome, user.senha];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }
}

module.exports = {
    User,
    UserDAO
};
