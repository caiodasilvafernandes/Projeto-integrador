const mysql = require('mysql2');

//conexao com o banco
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kitbay'
})

try {
    conn.connect();
} catch (err) {
    console.log(err);
}

module.exports = conn;