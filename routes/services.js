var express = require('express')
var router = express.Router();
var db = require('../db')

router.get('/', function (req, res) {
    db.query('SELECT * FROM services', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

module.exports = router;