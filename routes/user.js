var express = require('express')
var router = express.Router();
var db = require('../db')
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var moment = require('moment')

router.post('/adduser', upload.none(), function (req, res) {
    let { username, password, email, firstName, lastName } = req.body
    const dateTimeSql = moment().format("YYYY-MM-DD HH:mm:ss")
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) throw err
        let query = 'INSERT INTO users (username, passwrd, firstName, lastName, email, dateCreated) VALUES (?, ?, ?, ?, ?, ?)'
        let queryData = [username, hash, firstName, lastName, email, dateTimeSql]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    });
})

router.get('/getusers', upload.none(), (req, res) => {
    const { searchCriteria } = req.query

    let query = 'SELECT id, username, email, firstName, lastName, dateCreated FROM users';
    let queryData = []

    // Builds query to search through each column if there is a searchCriteria
    if (searchCriteria) {
        query += ' WHERE '

        const searchColumns = ['username', 'email', 'firstName', 'lastName']
        for (let i in searchColumns) {
            // Ensures no trailing ' OR '
            if (i == searchColumns.length - 1) {
                query += `${searchColumns[i]} LIKE ?`
            } else {
                query += `${searchColumns[i]} LIKE ? OR `
            }
            queryData.push(`%${searchCriteria}%`)
        }
    }

    db.query(query, queryData, (err, rows) => {
        if (err) throw err

        res.send(rows);
    })
});

router.post('/updateuser', upload.none(), (req, res) => {
    const {email, firstName, lastName, id} = req.body;
    const query = 'UPDATE users SET email=?, firstName=?, lastName=? WHERE id=?';
    const queryData = [email, firstName, lastName, id];

    db.query(query, queryData, (err, rows) => {
        if (err) {
            throw err
            //res.status(409).send('Email is not unique.');
        } else {
            res.status(200).send(`User ${req.body.username} updated`);
        }
    })
})

router.delete('/deleteuser', (req, res) => {
    const { id } = req.query;
    const query = 'DELETE FROM users WHERE id=?';
    const queryData = [id];
    db.query(query, queryData, (err, rows) => {
        if (err) throw err
        res.send(rows);
    })
})

router.get('/validate', function (req, res) {
    let { user } = req.cookies
    jwt.verify(user, process.env.TOKEN_SECRET, function (err, data) {
        if (err) { res.sendStatus(403) }
        else {
            res.json({ validated: true })
        }
    })
})

router.post('/login', upload.none(), function (req, res) {
    let { username, password } = req.body
    let query = 'SELECT * FROM users WHERE username=?'
    let queryData = [username]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        if (rows.length < 1) { res.status(500).send('Incorrect username or password') }
        else {
            bcrypt.compare(password, rows[0].passwrd, function (err, result) {
                if (!result) { res.status(500).send('Incorrect username or password') }
                else {
                    let token = jwt.sign({ username: username }, process.env.TOKEN_SECRET, { expiresIn: '1800s' })
                    let query = 'UPDATE users SET token=? WHERE ID=?'
                    let queryData = [token, rows[0].id]
                    db.query(query, queryData)
                    res.send(token)
                }
            })
        }
    })
})

module.exports = router;