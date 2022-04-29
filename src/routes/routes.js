const { Router } = require('express');

const { Controller } = require('../controllers/controller');

const routes = Router();

const controller = new controller();

//routes.get('/cadastrar', controller.mostraCadastro);

//routes.get('/deletar/:id', controller.deletar);

routes.get('/', controller.listar);

//routes.get('/:id', controller.detalhar);

//routes.post('/', controller.cadastrar);

//routes.get('/alterar/:id', controller.mostraAlterar);
//routes.post('/alterar/:id', controller.alterar);

module.exports = routes;