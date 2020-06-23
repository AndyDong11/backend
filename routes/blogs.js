var express = require('express')
var router = express.Router();
var db = require('../db')

router.get('/', function (req, res) {

    let postsPerPage = req.query.postsPerPage
    let currentPage = req.query.currentPage
    let offset = postsPerPage*currentPage

    let query = 'SELECT * FROM blogs ORDER BY ID LIMIT ' + offset + ', ' + postsPerPage

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/postcount', function (req, res) {
    db.query('SELECT COUNT(*) FROM blogs', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

module.exports = router;