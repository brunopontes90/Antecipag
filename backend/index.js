const fs = require('fs');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const express = require('express');
const Database = require('./Connect.js');
const port = 3001;

const app = express();
const db = new Database();

app.use(cors());
app.use(express.json());

// Configuração do Multer para upload de arquivos
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = 'uploads/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    })
});


// Função para inserir dados no banco.
function insertData(data) {
    const query = 'INSERT INTO clients (name_client, email_client, cnpj_client, name_enterprise, amount_paid, isadmin) VALUES (?, ?, ?, ?, ?, ?)';
    data.forEach((row, index) => {
        db.query(query, [
            row.name_client || 'N/A',
            row.email_client || 'N/A',
            row.cnpj_client || 'N/A',
            row.name_enterprise || 'N/A',
            parseFloat(row.amount_paid) || 0,
            parseInt(row.isadmin) || 0
        ], (err, result) => {
            if (err) {
                console.error(`Erro ao inserir a linha ${index + 1}: ${err}`);
            } else {
                console.log(`Linha ${index + 1} inserida com sucesso:`, result);
            }
        });
    });
}

// Função para processar o arquivo .txt
function processTxtFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erro ao ler o arquivo .txt: ${err}`);
            callback(err, null);
            return;
        }

        // Separar linhas do arquivo
        const lines = data.split('\n').filter(line => line.trim() !== '');

        // Separar o cabeçalho e os dados
        const headers = lines[0].split(',').map(header => header.trim());
        const rows = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim());
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {});
        });

        callback(null, rows);
    });
}

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

// Rota para upload de arquivo .txt
app.post('/upload/txt', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    const filePath = req.file.path;

    processTxtFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send('Erro ao processar o arquivo .txt.');
            return;
        }

        console.log('Dados TXT lidos: ');
        insertData(data);

        // Remove o arquivo temporário
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Erro ao remover arquivo: ${err}`);
        });

        res.send('Dados do arquivo TXT inseridos no banco de dados.');
    });
});

// Rota para criar cliente manualmente
app.post('/post/clients', (req, res) => {
    const client = req.body;

    const query = 'INSERT INTO clients (name_client, email_client, cnpj_client, name_enterprise, amount_paid, isadmin) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query,
        [
            client.name_client,
            client.email_client,
            client.cnpj_client,
            client.name_enterprise,
            client.amount_paid,
            client.isadmin
        ],
        (err, result) => {
            if (err) {
                console.error(`Erro ao inserir cliente: ${err}`);
                res.status(500).send('Erro ao inserir cliente.');
            } else {
                res.send('Cliente cadastrado com sucesso!');
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

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    let deleteQuery = "DELETE FROM clients WHERE id=?";
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Erro ao deletar usuário.');
        } else {
            res.send(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor em execução na porta: ${port}`);
});