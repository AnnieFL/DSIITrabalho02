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
            if (req.query.erro) {
                return res.render('cadastro', {erro: req.query.erro});
            }
            return res.render('cadastro');
        } else {
            const userId = await UserDAO.buscaPeloEmail(user);
            const gruposId = await GrupoUserDAO.buscaPeloUser(userId.id);
            const grupos = await GrupoDAO.buscaPelosIds(gruposId);
            let grupoUsers = null;
            for (let i=0; i<grupos.length; i++) {
                grupoUsers = await GrupoUserDAO.buscaPorAmbos([userId.id, grupos[i].id]);
                grupos[i].admin = grupoUsers.admin;
                grupos[i].mudo = grupoUsers.mudo;
            }

            const convitesId = await GrupoUserDAO.encontraConvites(userId.id);
            const convites = await GrupoDAO.buscaPelosIds(convitesId);
            for (let i = 0; i<convitesId.length; i++) {
                convites[i].mudo = convitesId[i].mudo;
                convites[i].convite = convitesId[i].id;
            }
            
            return res.render('index',{usuario: req.session.user, grupos: grupos, convites: convites}); 
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

            if (nome != "" && email != "" && senha != "") {
                const userId = await UserDAO.buscaPeloEmail(email);
                if (userId == undefined) {
                    const crypt = bcrypt.hashSync(senha, 10);
                    
                    const user = new User(null, email, nome, crypt);
                    await UserDAO.cadastrar(user);
                    
                    req.session.user = email;
                    return res.redirect('/');
                } else {
                    return res.redirect('/?erro=repetido');
                }
            } else {
                return res.redirect('/?erro=invalido');
            }
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
        
        if (nome != "" && imagem != "" && user) {
            const grupo = new Grupo(grupoId, nome, imagem);
            await GrupoDAO.cadastrar(grupo);
            
            const userId = await UserDAO.buscaPeloEmail(user);
    
            const grupoUser = new GrupoUser(null, grupoId, userId.id, false, true, true);
            await GrupoUserDAO.cadastrar(grupoUser);
        }

        return res.redirect('/');
    }

    async grupo(req,res) {
        const {user} = req.session;

        if (user) {
            const { id } = req.params;
            const grupo = await GrupoDAO.buscaPeloId(id);
            
            const mainUser = await UserDAO.buscaPeloEmail(user);
            const mainUserEx = await GrupoUserDAO.buscaPorAmbos([mainUser.id, grupo.id]);

            if (grupo != [] && mainUserEx != []) {
                const groupUsersIds = await GrupoUserDAO.buscaPeloGrupo(grupo.id);
                const groupUsers = await UserDAO.buscaPelosIds(groupUsersIds);
                for (let i = 0; i<groupUsersIds.length; i++) {
                    groupUsers[i].grupoUser = groupUsersIds[i].id;
                    groupUsers[i].mudo = groupUsersIds[i].mudo;
                    groupUsers[i].admin = groupUsersIds[i].admin;
                }
    
                mainUser.grupoUser = mainUserEx.id;
                mainUser.mudo = mainUserEx.mudo;
                mainUser.admin = mainUserEx.admin;
                
                const mensagens = await MensagemDAO.dentroDoGrupo(grupo.id);
    
                return res.render('grupo', { user:mainUser, grupo: grupo, mensagens: mensagens, groupUsers: groupUsers});
            } else {
                return res.redirect('/');
            }
        } else {
            return res.redirect('/');
        }
    }

    async enviarMensagem(req,res) {
        const {user} = req.session;
        const userId = await UserDAO.buscaPeloEmail(user);
        const { conteudo, grupo } = req.body;

        const grupoCheck = await GrupoDAO.buscaPeloId(grupo);
        
        if (user && conteudo.trim() != "" && grupo != "" && grupoCheck != []) {
            const mainUser = await UserDAO.buscaPeloEmail(user);
            const mainUserEx = await GrupoUserDAO.buscaPorAmbos([mainUser.id, grupo]);

            if (!mainUserEx.mudo) {
                const mensagem = new Mensagem(null, conteudo, userId.id, grupo, new Date().toLocaleString());
                await MensagemDAO.cadastrar(mensagem);
                
                return res.redirect('/grupo/'+grupo);
            } else {
                return res.redirect('/grupo/'+grupo);
            }
        } else if (grupo!= ""){
            return res.redirect('/grupo/'+grupo);
        } else {
            return res.redirect('/');
        }
    }

    async convidar(req, res) {
        const { user, grupo, mudo } = req.body;
        let boolMudo = false;
        mudo == "on" ? boolMudo = true : boolMudo = false;
        const userId = await UserDAO.buscaPeloEmail(req.session.user);
        

        if (user != "" && grupo != "") {
            const grupoUserCheck = await GrupoUserDAO.buscaPorAmbos([user, grupo]);
            const adminCheck = await GrupoUserDAO.buscaPorAmbos([userId.id, grupo]);
            
            if (grupoUserCheck != [] && adminCheck.admin) {
                const grupoUser = new GrupoUser(null, grupo, user, boolMudo, false, false);
                await GrupoUserDAO.cadastrar(grupoUser);
        
        
                return res.redirect('/ListaConvites/'+grupo)
            } else {
                return res.redirect('/');
            }

        } else {
            return res.redirect('/');
        }

    }

    async convite(req, res) {
        if (req.session.user && req.query.convite) {
            const grupoUserCheck = await GrupoUserDAO.buscaPeloId(req.query.convite);
            const userCheck = await UserDAO.buscaPeloEmail(req.session.user);

            if (grupoUserCheck.user == userCheck.id) {    
                if (req.query.aceito == "true") {
                    await GrupoUserDAO.aceita(req.query.convite);
                    return res.redirect('/');
                } else if (req.query.aceito == "false") {
                    await GrupoUserDAO.negar(req.query.convite);
                    return res.redirect('/');
                    
                } else {
                    return res.redirect('/');
                }
            } else {
                return res.redirect('/');
            }
        } else {
            return res.redirect('/');
        }
    }

    async sair(req, res) {
        const {id} = req.params;

        const grupoUser = await GrupoUserDAO.buscaPeloId(id);
        const user = await UserDAO.buscaPeloEmail(req.session.user);
        if (user.id == grupoUser.user || grupoUser.admin == true) {
            await GrupoUserDAO.negar(id);
    
            if (user.id == grupoUser.user) {
                return res.redirect('/')
            } else {
                return res.redirect('/grupo/'+grupoUser.grupo);
            }
        } else {
            return res.redirect('/');
        }
    }

    async apagar(req,res) {
        const {id} = req.params;
        const {user} = req.session;

        const userCheck = await UserDAO.buscaPeloEmail(user);
        if (user) {

            const grupoUserCheck = await GrupoUserDAO.buscaPorAmbos([userCheck.id, id]);
            
            if (grupoUserCheck.admin == true) {
                const mensagens = await MensagemDAO.buscaPeloGrupo(id);
                for (let i = 0; i<mensagens.length; i++) {
                    await MensagemDAO.apagar(mensagens[i].id);
                } 
        
                const grupoUsers = await GrupoUserDAO.buscaPeloGrupo(id);
                for (let i = 0; i<grupoUsers.length; i++) {
                    await GrupoUserDAO.negar(grupoUsers[i].id);
                }
                
                await GrupoDAO.apagar(id);
        }
        }
        

        return res.redirect('/');
    }

    async logout(req,res) {
        req.session.user = null;
        return res.redirect('/');
    }

    async lista(req,res) {
        const {user} = req.session;

        if (user) {
            const { id } = req.params;
            const grupo = await GrupoDAO.buscaPeloId(id);
            
            const adminCheck = await UserDAO.buscaPeloEmail(req.session.user);
            const grupoUserCheck = await GrupoUserDAO.buscaPorAmbos([adminCheck.id, id]);
            
            if (grupo && grupoUserCheck.admin) {
                const {pesquisa} = req.query;
                if (pesquisa) {
                    const otherUsersIds = await GrupoUserDAO.buscaPeloGrupoSemFiltro(grupo.id)
                    const otherUsers = await UserDAO.buscaTodosMenosWhere([otherUsersIds, pesquisa]);
        
                    const mainUser = await UserDAO.buscaPeloEmail(user);
                    const mainUserEx = await GrupoUserDAO.buscaPorAmbos([mainUser.id, grupo.id]);
                    mainUser.grupoUser = mainUserEx.id;
                    mainUser.mudo = mainUserEx.mudo;
                    mainUser.admin = mainUserEx.admin;
                    return res.render('lista', { user:mainUser, grupo: grupo, otherUsers: otherUsers});
                } else {
                    const otherUsersIds = await GrupoUserDAO.buscaPeloGrupoSemFiltro(grupo.id)
                    const otherUsers = await UserDAO.buscaTodosMenos(otherUsersIds);
        
                    const mainUser = await UserDAO.buscaPeloEmail(user);
                    const mainUserEx = await GrupoUserDAO.buscaPorAmbos([mainUser.id, grupo.id]);
                    mainUser.grupoUser = mainUserEx.id;
                    mainUser.mudo = mainUserEx.mudo;
                    mainUser.admin = mainUserEx.admin;
                    return res.render('lista', { user:mainUser, grupo: grupo, otherUsers: otherUsers});
                }
            } else {
                return res.redirect('/');
            }
        } else {
            return res.redirect('/');
        }
    }

    async mutar(req,res) {
        const {user} = req.session;
        const {id} = req.params;

        const grupoUserCheck = await GrupoUserDAO.buscaPeloId(id);
        const userCheck = await UserDAO.buscaPeloEmail(user);
        const adminCheck = await GrupoUserDAO.buscaPorAmbos([userCheck.id, grupoUserCheck.grupo]);

        if (adminCheck.admin && grupoUserCheck.id != "") {
            await GrupoUserDAO.mutar([grupoUserCheck.id, !(grupoUserCheck.mudo)])
        }
        if (grupoUserCheck.grupo) {
            return res.redirect('/grupo/'+grupoUserCheck.grupo);
        } else {
            return res.redirect('/');
        }
    }
}

module.exports = {Controller};