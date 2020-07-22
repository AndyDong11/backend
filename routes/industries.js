var express = require('express')
var router = express.Router();
var db = require('../db')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })


router.get('/', function (req, res) {
    let query = 'SELECT * FROM industriesindustries'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/industrycount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM industriesindustries WHERE title LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/industriesonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM industriesindustries WHERE title LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.post('/addindustry', upload.none(), function (req, res) {
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    let query = 'INSERT INTO industriesindustries (icon, title, content) VALUES (?, ?, ?)'
    let queryData = [icon, title, content]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getindustry', function (req, res) {
    let id = req.query.id
    let query = 'SELECT * FROM industriesindustries WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateindustry', upload.none(), function (req, res) {
    let id = req.body.id
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    let query = 'UPDATE industriesindustries SET icon=?, title=?, content=? WHERE id=?'
    let queryData = [icon, title, content, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deleteindustry', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM industriesindustries WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;