var express = require('express')
var router = express.Router();
var db = require('../db')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs')
var s3 = require('../aws_s3')

const params = {
    ACL: 'public-read',
    Bucket: 'falcnstuff',
    Body: '',
    Key: ''
}

async function read(file) {

    return new Promise(async function (resolve, reject) {

        const fileStream = fs.createReadStream(file.path)
        fileStream.on('error', function (err) {
            console.log('File Error', err);
        });
        params.Body = fileStream
        params.Key = file.filename + '-' + file.originalname.split('.')[0]

        await s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            }

            if (data) {
                resolve(data.Location)
            }
        })

    })
}

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
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM news WHERE title LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/newsonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM news WHERE title LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.post('/addnews', upload.array('images'), function (req, res) {
    let images = []
    for (let i = 0; i < req.files.length; i++) {
        images.push(read(req.files[i]))
    }
    Promise.all(images).then(async (imageURLs) => {
        let articleLink = req.body.articleLink
        let category = req.body.category
        let title = req.body.title
        let content = req.body.content
        let author = req.body.author
        let postedDate = req.body.postedDate
        let articleImage = req.body.articleImage
        let articleImageAlt = req.body.articleImageAlt
        let authorImage = req.body.authorImage
        let authorImageAlt = req.body.authorImageAlt
        if (req.body.articleImageType == 'Local') {
            articleImage = imageURLs[articleImage]
        }
        if (req.body.authorImageType == 'Local') {
            authorImage = imageURLs[req.body.authorImage]
        }
        let query = 'INSERT INTO news (articleLink, category, title, content, author, postedDate, articleImage, articleImageAlt, authorImage, authorImageAlt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        let queryData = [articleLink, category, title, content, author, postedDate, articleImage, articleImageAlt, authorImage, authorImageAlt]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }, reason => { console.log(reason) })
})

router.get('/getnews', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM news WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatenews', upload.array('images'), function (req, res) {
    let images = []
    for (let i = 0; i < req.files.length; i++) {
        images.push(read(req.files[i]))
    }
    Promise.all(images).then(async (imageURLs) => {
        let id = req.body.id
        let articleLink = req.body.articleLink
        let category = req.body.category
        let title = req.body.title
        let content = req.body.content
        let author = req.body.author
        let postedDate = req.body.postedDate
        let articleImage = req.body.articleImage
        let articleImageAlt = req.body.articleImageAlt
        let authorImage = req.body.authorImage
        let authorImageAlt = req.body.authorImageAlt
        if (req.body.articleImageType == 'Local') {
            articleImage = imageURLs[articleImage]
        }
        if (req.body.authorImageType == 'Local') {
            authorImage = imageURLs[req.body.authorImage]
        }
        let query = 'UPDATE news SET articleLink=?, category=?, title=?, content=?, author=?, postedDate=?, articleImage=?, articleImageAlt=?, authorImage=?, authorImageAlt=? WHERE ID=?'
        let queryData = [articleLink, category, title, content, author, postedDate, articleImage, articleImageAlt, authorImage, authorImageAlt, id]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }, reason => { console.log(reason) })
})

router.get('/deletenews', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM news WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;