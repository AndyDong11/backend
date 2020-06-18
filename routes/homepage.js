var express = require('express')
var router = express.Router();
var db = require('../db')



router.get('/banner', function (req, res) {
    db.query('SELECT * FROM homepagebanner', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/services', function (req, res) {
    db.query('SELECT * FROM homeservices', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/whatwedo', function (req, res) {
    db.query('SELECT * FROM whatwedo', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/clients', function (req, res) {
    db.query('SELECT * FROM clients', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

module.exports = router;