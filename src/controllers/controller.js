const bcrypt = require('bcrypt');
const {nanoid} = require('nanoid');
const { dbcon } = require('../config/connection-db');
const { User, UserDAO } = require('../models/UserModel');
const { Grupo, GrupoDAO } = require('../models/GrupoModel');
const { GrupoUser, GrupoUserDAO } = require('../models/GrupoUserModel');
const { Mensagem, MensagemDAO } = require('../models/MensagemModel');

class Controller {
    async index(req,res) {
        const {user} = req.session;
        
        if (!user) {
            return res.render('cadastro');
        } else {
            const userId = await UserDAO.buscaPeloEmail(user);
            const gruposId = await GrupoUserDAO.buscaPeloUser(userId.id);
            const grupos = await GrupoDAO.buscaPelosIds(gruposId);
            
            return res.render('index',{usuario: req.session.user, grupos: grupos}); 
        }
    }

    async login(req,res) {
        if (req.query.erro) {
            return res.render('cadastro', {login: true, erro: true});
        }
        return res.render('cadastro', {login: true});
    }

    async cadastrar(req, res) {
        if (req.query.login) {
            const {email, senha } = req.body;

            const user = await UserDAO.buscaPeloEmail(email);
            if (user && bcrypt.compareSync(senha, user.senha)) {
                req.session.user = email;
                return res.redirect('/');
            } else {
                return res.redirect('/login?erro=true');
            }
            
        } else {
            const { nome, email, senha } = req.body;
            const crypt = bcrypt.hashSync(senha, 10);
            
            const user = new User(null, email, nome, crypt);
            await UserDAO.cadastrar(user);
            
            req.session.user = email;
            return res.redirect('/');
        }
    }

    async criarGrupo(req, res) {
        if (req.session.user) {
            return res.render('criarGrupo', {user : req.session.user});
        } else {
            return res.redirect('/');
        }
    }

    async criarGrupoPost(req, res) {
        const {user} = req.session;
        const { nome, imagem } = req.body;
        const grupoId = nanoid(8);
        
        const grupo = new Grupo(grupoId, nome, imagem);
        await GrupoDAO.cadastrar(grupo);
        
        const userId = await UserDAO.buscaPeloEmail(user);

        const grupoUser = new GrupoUser(null, grupoId, userId.id, false, true);
        await GrupoUserDAO.cadastrar(grupoUser);

        return res.redirect('/');
    }

    async grupo(req,res) {
        const {user} = req.session;

        if (user) {
            const { id } = req.params;
            const grupo = await GrupoDAO.buscaPeloId(id);

            const mensagens = await MensagemDAO.dentroDoGrupo(grupo.id);

            return res.render('grupo', { user:user, grupo: grupo, mensagens: mensagens});
        } else {
            return res.redirect('/');
        }
    }

    async enviarMensagem(req,res) {
        const {user} = req.session;
        const userId = await UserDAO.buscaPeloEmail(user);
        const { conteudo, grupo } = req.body;
        
        const mensagem = new Mensagem(null, conteudo, userId.id, grupo, new Date().toLocaleString());
        await MensagemDAO.cadastrar(mensagem);
        
        return res.redirect('/grupo/'+grupo);
    }
}

module.exports = {Controller};