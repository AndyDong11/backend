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

router.get('/', function (req, res) {
    let postsPerPage = req.query.postsPerPage
    let currentPage = req.query.currentPage
    let offset = postsPerPage * currentPage
    let query = 'SELECT * FROM blogs ORDER BY ID LIMIT ' + offset + ', ' + postsPerPage
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

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

router.get('/postcount', function (req, res) {
    db.query('SELECT COUNT(*) FROM blogs', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/getblog', function (req, res) {
    const id = req.query.id
    db.query('SELECT * FROM blogs WHERE id=' + id, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.post('/addblog', upload.array('images'), function (req, res) {
    let images = []
    for (let i = 0; i < req.files.length; i++) {
        images.push(read(req.files[i]))
    }
    Promise.all(images).then(async (imageURLs) => {
        let { headerImageType, headerImage, headerImageAlt, category, title, content, authorName, authorImageType, authorImage, authorImageAlt, postedDate } = req.body
        if (headerImageType == 'Local') {
            headerImage = imageURLs[headerImage]
        }
        if (authorImageType == 'Local') {
            authorImage = imageURLs[authorImage]
        }
        let query = 'INSERT INTO blogs (headerImage, headerImageAlt, category, title, content, authorName, authorImage, authorImageAlt, postedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        let queryData = [headerImage, headerImageAlt, category, title, content, authorName, authorImage, authorImageAlt, postedDate]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }, reason => {
        console.log(reason);
    });
})

router.post('/updateblog', upload.array('images'), function (req, res) {
    let images = []
    for (let i = 0; i < req.files.length; i++) {
        images.push(read(req.files[i]))
    }
    Promise.all(images).then(async (imageURLs) => {
        let { id, headerImageType, headerImage, headerImageAlt, category, title, content, authorName, authorImageType, authorImage, authorImageAlt, postedDate } = req.body
        if (headerImageType == 'Local') {
            headerImage = imageURLs[headerImage]
        }
        if (authorImageType == 'Local') {
            authorImage = imageURLs[authorImage]
        }
        let query = 'UPDATE blogs SET headerImage=?, headerImageAlt=?, category=?, title=?, content=?, authorName=?, authorImage=?, authorImageAlt=?, postedDate=? WHERE ID=?'
        let queryData = [headerImage, headerImageAlt, category, title, content, authorName, authorImage, authorImageAlt, postedDate, id]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }, reason => {
        console.log(reason);
    });
})

//blogs count
router.get('/blogscount', function (req, res) {

    let searchCriteria = req.query.searchCriteria

    db.query('SELECT COUNT(*) FROM blogs WHERE title LIKE \'%' + searchCriteria + '%\'', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

//paginated blogs
router.get('/paginatedblogs', function (req, res) {

    let itemsPerPage = req.query.itemsPerPage
    let currentPage = req.query.currentPage
    let searchCriteria = req.query.searchCriteria
    let offset = itemsPerPage * currentPage

    let query = 'SELECT * FROM blogs WHERE title LIKE \'%' + searchCriteria + '%\' ORDER BY ID LIMIT ' + offset + ', ' + itemsPerPage

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

//delete blogs
router.get('/deleteblogs', upload.none(), function (req, res) {
    let id = req.query.id
    let query = 'DELETE FROM blogs WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;