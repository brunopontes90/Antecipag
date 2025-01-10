const mysql = require('mysql2');
const dotenv = require('dotenv').config();

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.HOSTNAME,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
        });

        this.connect();
    }

    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error(`Erro ao conectar ao banco de dados: ${err}`);
            } else {
                console.log('Conexão bem-sucedida ao banco de dados!');
            }
        });
    }

    query(sql, values, callback) {
        this.connection.query(sql, values, (err, result) => {
            if (err) {
                console.error(`Erro na consulta SQL: ${err}`);
                if (callback) {
                    callback(err, null);
                }
            } else {
                if (callback) {
                    callback(null, result);
                }
            }
        });
    }

    close() {
        this.connection.end((err) => {
            if (err) {
                console.error(`Erro ao fechar a conexão: ${err}`);
            } else {
                console.log('Conexão encerrada.');
            }
        });
    }
}

// Testando a conexão
const db = new Database();
