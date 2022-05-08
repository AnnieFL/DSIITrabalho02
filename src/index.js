
const express = require('express');
const app = express();

app.use(express.static('../public'));

app.set('view engine', 'ejs');
app.set('views', './src/view');

app.use(express.urlencoded({
    extended: true,
}));


app.use(express.json());

const session = require('express-session');
app.use(session({
    secret: 'chave secreta de criptografia',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))


app.use(express.static('public'));

const routes = require('./routes/routes');
app.use('/', routes);

app.use('*', (req, res) => {
    return res.redirect('/');
})

const dbcon = require('./config/connection-db');

const PORT = process.env.PORT || 3000;
console.log({PORT});
app.listen(PORT, () => console.log(`Server iniciado na porta ${PORT}`));