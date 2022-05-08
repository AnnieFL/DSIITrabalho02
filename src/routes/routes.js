const { Router } = require('express');

const { Controller } = require('../controllers/controller');

const routes = Router();

const controller = new Controller();

routes.get('/grupo/:id', controller.grupo);

routes.get('/criarGrupo', controller.criarGrupo);

routes.get('/login', controller.login);

routes.get('/convite', controller.convite);

routes.get('/sair/:id', controller.sair);

routes.get('/apagar/:id', controller.apagar);

routes.get('/mutar/:id', controller.mutar);

routes.get('/ListaConvites/:id', controller.lista);

routes.get('/logout', controller.logout);

routes.get('/', controller.index);


routes.post('/cadastrar', controller.cadastrar)

routes.post('/criarGrupo', controller.criarGrupoPost);

routes.post('/grupo', controller.enviarMensagem)

routes.post('/convidar', controller.convidar);

module.exports = routes;