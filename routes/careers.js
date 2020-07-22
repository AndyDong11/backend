var express = require('express')
var router = express.Router();
var db = require('../db')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })


/** careers description */
router.get('/', function (req, res) {
    let query = 'SELECT * FROM careersdescription'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.post('/updatecareersdescription', upload.none(), function (req, res) {
    let {content} = req.body
    let query = 'UPDATE careersdescription SET content=?'
    let queryData = [content]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

/** careers list */
router.get('/getcareerslist', function (req, res) {
    let query = 'SELECT * FROM careerslist'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/careerslistcount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM careerslist WHERE title LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/careersonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM careerslist WHERE title LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/deletecareer', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM careerslist WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addcareer', upload.none(), function (req, res) {
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    let query = 'INSERT INTO careerslist (icon, title, content) VALUES (?, ?, ?)'
    let queryData = [icon, title, content]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getcareer', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM careerslist WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatecareer', upload.none(), function (req, res) {
    let id = req.body.id
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    let query = 'UPDATE careerslist SET icon=?, title=?, content=? WHERE id=?'
    let queryData = [icon, title, content, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})


module.exports = router;