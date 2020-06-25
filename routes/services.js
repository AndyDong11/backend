var express = require('express')
var router = express.Router();
var db = require('../db')

router.get('/', function (req, res) {
    db.query('SELECT * FROM services', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/servicecount', function (req, res) {

    let searchCriteria = req.query.searchCriteria

    db.query('SELECT COUNT(*) FROM services WHERE title LIKE \'%' + searchCriteria + '%\'', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/paginatedservices', function (req, res) {

    let itemsPerPage = req.query.itemsPerPage
    let currentPage = req.query.currentPage
    let searchCriteria = req.query.searchCriteria
    let offset = itemsPerPage * currentPage

    let query = 'SELECT * FROM services WHERE title LIKE \'%' + searchCriteria + '%\' ORDER BY ID LIMIT ' + offset + ', ' + itemsPerPage

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});


router.post('/addservice', function (req, res) {
    let icon = req.body.icon
    let sideIcon = req.body.sideIcon
    let title = req.body.title
    let content = req.body.content

    let query = 'INSERT INTO services (icon, sideIcon, title, content) VALUES (\'' + icon + '\', \'' + sideIcon + '\', \'' + title + '\', \'' + content + '\')'

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getservice', function (req, res) {

    let service = req.query.service

    let query = 'SELECT * FROM services WHERE id=\'' + service + '\''

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateservice', function (req, res) {

    let id = req.body.id
    let icon = req.body.icon
    let sideIcon = req.body.sideIcon
    let title = req.body.title
    let content = req.body.content


    let query = 'UPDATE services SET icon=\'' + icon + '\', sideIcon=\'' + sideIcon + '\', title=\'' + title + '\', content=\'' + content + '\' WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/deleteservice', function (req, res) {

    let id = req.body.id

    let query = 'DELETE FROM services WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;