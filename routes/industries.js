var express = require('express')
var router = express.Router();
var db = require('../db')



router.get('/', function (req, res) {
    db.query('SELECT * FROM industries', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/industrycount', function (req, res) {

    let searchCriteria = req.query.searchCriteria

    db.query('SELECT COUNT(*) FROM industries WHERE title LIKE \'%' + searchCriteria + '%\'', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/paginatedindustries', function (req, res) {

    let itemsPerPage = req.query.itemsPerPage
    let currentPage = req.query.currentPage
    let searchCriteria = req.query.searchCriteria
    let offset = itemsPerPage * currentPage

    let query = 'SELECT * FROM industries WHERE title LIKE \'%' + searchCriteria + '%\' ORDER BY ID LIMIT ' + offset + ', ' + itemsPerPage

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});


router.post('/addindustry', function (req, res) {
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content

    let query = 'INSERT INTO industries (icon, title, content) VALUES (\'' + icon + '\', \'' + title + '\', \'' + content + '\')'

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getindustry', function (req, res) {

    let industry = req.query.service

    let query = 'SELECT * FROM industries WHERE id=\'' + industry + '\''

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateindustry', function (req, res) {

    let id = req.body.id
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content


    let query = 'UPDATE industries SET icon=\'' + icon + '\', title=\'' + title + '\', content=\'' + content + '\' WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/deleteindustry', function (req, res) {

    let id = req.body.id

    let query = 'DELETE FROM industries WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;