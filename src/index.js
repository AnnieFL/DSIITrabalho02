
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/view');

// PARSER DOS FORMULÁRIOS
app.use(express.urlencoded({
    extended: true,
}));

// PARSER DAS REQUISIÇOES COM JSON
app.use(express.json());

const session = require('express-session');
app.use(session({
    secret: 'chave secreta de criptografia',
    resave: false, // NAO SOBRESCREVER CASO NAO HAJA MODIFICAÇÕES,
    saveUninitialized: false,
    cookie: { secure: false }
}))


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/filmes');
});

const routes = require('./routes/routes');
app.use('/', routes);

app.use('*', (req, res) => {
    return res.status(404).send(`
        <h1>Sorry, not found!!!</h1>
        <a href="/">VOLTAR</a>
    `);
})

const { dbcon } = require('./config/connection-db');
// console.log(dbcon);

const PORT = process.env.PORT;
console.log({PORT});
app.listen(PORT, async () => {
    await dbcon();
    
    console.log(`Server iniciado na porta ${PORT}`)
});