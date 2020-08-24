var mysql = require('mysql2')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'falcnlab'
})

connection.connect()

module.exports = connection