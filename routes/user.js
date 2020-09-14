var express = require('express')
var router = express.Router();
var db = require('../db')
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

router.post('/adduser', upload.none(), function (req, res) {
    let { username, password, email, firstName, lastName, department } = req.body
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) throw err
        let query = 'INSERT INTO users (username, passwrd, firstName, lastName, email, department) VALUES (?, ?, ?, ?, ?, ?)'
        let queryData = [username, hash, firstName, lastName, email, department]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    });
})

router.get('/getusers', upload.none(), (req, res) => {
    const query = 'SELECT id, username, email, firstName, lastName, department FROM users';
    db.query(query, [], (err, rows) => {
        if (err) throw err

        res.send(rows);
    })
});

router.post('/updateuser', upload.none(), (req, res) => {
    const {email, firstName, lastName, department, id} = req.body;
    const query = 'UPDATE users SET email=?, firstName=?, lastName=?, department=? WHERE id=?';
    const data = [email, firstName, lastName, department, id];
    // Filter through so sql doesn't interpret null as 'null'
    const queryData = data.map((field) => {
        if (field === 'null' || field === 'undefined') {
            return '';
        } else {
            return field;
        }
    });
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

    let { userId } = req.session
    const query = 'SELECT department FROM users WHERE id=?'

    db.query(query, [userId],(err, rows) => {
        if (err) throw err
        if (rows) {
            const { department } = rows[0]
            if (req.query.urlPath === '/admin/settings/users') {
                const validDepartments = ['hr', 'it']
                if (validDepartments.includes(department.toLowerCase())) {
                    res.json({validated: true})
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.json({validated: true})
            }
        } else {
            res.sendStatus(403);
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
                    req.session.userId = rows[0].id
                    res.status(200).send(req.session.cookie)
                }
            })
        }
    })
})

module.exports = router;