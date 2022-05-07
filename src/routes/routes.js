const { Router } = require('express');

const { Controller } = require('../controllers/controller');

const routes = Router();

const controller = new Controller();

routes.get('/grupo/:id', controller.grupo);

routes.get('/criarGrupo', controller.criarGrupo);

routes.get('/login', controller.login);

routes.get('/', controller.index);


routes.post('/cadastrar', controller.cadastrar)

routes.post('/criarGrupo', controller.criarGrupoPost);

routes.post('/grupo', controller.enviarMensagem)

module.exports = routes;