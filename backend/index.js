const express = require('express');
const cors = require('cors');
const app = express();
const Database = require('./Connect.js');

const port = 3001;

const db = new Database();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    let SQL = "SELECT * FROM clients";
    db.query(SQL, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Erro ao executar a consulta.');
        } else {
            res.send(result);
        }
    });
});


app.listen(port, () => {
    console.log(`Servidor em execução na porta: ${port}`);
});