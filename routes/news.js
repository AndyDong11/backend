var express = require('express')
var router = express.Router();
var db = require('../db')

router.get('/', function (req, res) {


    let postsPerPage = req.query.postsPerPage
    let currentPage = req.query.currentPage
    let offset = postsPerPage * currentPage

    let query = 'SELECT * FROM news ORDER BY ID LIMIT ' + offset + ', ' + postsPerPage

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/postcount', function (req, res) {
    db.query('SELECT COUNT(*) FROM news', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/newscount', function (req, res) {

    let searchCriteria = req.query.searchCriteria

    db.query('SELECT COUNT(*) FROM news WHERE title LIKE \'%' + searchCriteria + '%\'', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/paginatednews', function (req, res) {

    let itemsPerPage = req.query.itemsPerPage
    let currentPage = req.query.currentPage
    let searchCriteria = req.query.searchCriteria
    let offset = itemsPerPage * currentPage

    let query = 'SELECT * FROM news WHERE title LIKE \'%' + searchCriteria + '%\' ORDER BY ID LIMIT ' + offset + ', ' + itemsPerPage

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});


router.post('/addnews', function (req, res) {

    let query = 'INSERT INTO news (uri, post_img, category, title, content, author_img, author, posted_date) VALUES ('

    for (const [key, value] of Object.entries(req.body)) {
        query += '\'' + value + '\', '
    }
    query = query.substring(0, query.length - 2)
    query += ')'

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getnews', function (req, res) {

    let news = req.query.news

    let query = 'SELECT * FROM news WHERE id=\'' + news + '\''

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatenews', function (req, res) {

    let id = req.body.id
    let uri = req.body.uri
    let post_img = req.body.post_img
    let category = req.body.category
    let title = req.body.title
    let content = req.body.content
    let author_img = req.body.author_img
    let author = req.body.author
    let posted_date = req.body.posted_date

    let query = 'UPDATE news SET uri=\'' + uri + '\', title=\'' + title + '\', content=\'' + content + '\', post_img=\'' + post_img +
        '\', category=\'' + category + '\', author_img=\'' + author_img + '\', author=\'' + author + '\', posted_date=\'' + posted_date + '\' WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/deletenews', function (req, res) {

    let id = req.body.id

    let query = 'DELETE FROM news WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;