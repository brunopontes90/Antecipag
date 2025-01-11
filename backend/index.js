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

app.put('/put/:id', (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    // Constroe a parte SET da consulta SQL dinamicamente
    const setClause = Object.keys(updatedFields)
        .map((key) => `${key} = ?`)
        .join(', ');

    const values = Object.values(updatedFields);

    // Adiciona o ID no final para garantir que a atualização seja aplicada apenas ao registro desejado
    values.push(id);

    // Constroe e executa a consulta SQL
    const updateQuery = `UPDATE clients SET ${setClause} WHERE ID = ?`;
    db.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error(`Erro na consulta SQL: ${err}`);
            res.status(500).send('Erro ao executar a atualização.');
        } else {
            res.send(result);
        }
    });
});


app.listen(port, () => {
    console.log(`Servidor em execução na porta: ${port}`);
});