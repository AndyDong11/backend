var express = require('express')
var router = express.Router();
var db = require('../db')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

router.get('/', function (req, res) {
    let query = 'SELECT * FROM faqsfaq'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/faqscount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM faqsfaq WHERE answer LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/faqsonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM faqsfaq WHERE answer LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/deletefaq', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM faqsfaq WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addfaq', upload.none(), function (req, res) {
    let question = req.body.question
    let answer = req.body.answer
    let query = 'INSERT INTO faqsfaq (question, answer) VALUES (?, ?)'
    let queryData = [question, answer]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getfaq', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM faqsfaq WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatefaq', upload.none(), function (req, res) {
    let id = req.body.id
    let question = req.body.question
    let answer = req.body.answer
    let query = 'UPDATE faqsfaq SET question=?, answer=? WHERE id=?'
    let queryData = [question, answer, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})


module.exports = router;