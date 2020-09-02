var express = require('express')
var router = express.Router();
var db = require('../db')
var fs = require('fs')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
// var s3 = require('../aws_s3')
var { cloudinary } = require('../cloudinary')
const deleteFiles = require('./../mixins/deleteFiles');


// const params = {
//     ACL: 'public-read',
//     Bucket: 'falcnstuff',
//     Body: '',
//     Key: ''
// }

/** tech partner */
router.get('/techpartner', function (req, res) {
    let query = 'SELECT * FROM abouttechpartner'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatetechpartner', upload.single('image'), function (req, res) {
    let { content, imageType, imageAlt, buttonText, buttonLink } = req.body
    let query = 'UPDATE abouttechpartner SET content=?, buttonText=?, buttonLink=?, imageAlt=?, image=?'
    if (imageType == 'Local') {
        // const fileStream = fs.createReadStream(req.file.path)
        // fileStream.on('error', function (err) { console.log('File Error', err) })
        // params.Body = fileStream
        // params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        // s3.upload(params, (err, data) => {
        //     if (err) { console.log("Error", err) }
        //     if (data) {
        //         db.query(query, [content, buttonText, buttonLink, imageAlt, data.Location], function (err, rows) {
        //             if (err) throw err
        //             res.send(rows)
        //         })
        //     }
        // })
        cloudinary.uploader.upload(req.file.path, function (err, data) {
            if (err) { console.log("Error", err) }
            if (data) {
                db.query(query, [content, buttonText, buttonLink, imageAlt, data.url], function (err, rows) {
                    if (err) throw err
                    deleteFiles([req.file]);
                    res.send(rows)
                })
            }
        })
    }
    else {
        db.query(query, [content, buttonText, buttonLink, imageAlt, req.body.image], function (err, rows) {
            if (err) throw err
            deleteFiles([req.file]);
            res.send(rows)
        })
    }
})

/** how we do it */
router.get('/howwedoit', function (req, res) {
    let query = 'SELECT * FROM abouthowwedoit'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/howwedoitcount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM abouthowwedoit WHERE header LIKE ?'
    let data = [searchCriteria]
    db.query(query, data, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/howwedoitonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM abouthowwedoit WHERE header LIKE ? ORDER BY ID LIMIT ?, ?'
    let data = [searchCriteria, offset, itemsPerPage]
    db.query(query, data, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/gethowwedoit', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM abouthowwedoit WHERE id=?'
    let data = [id]
    db.query(query, data, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deletehowwedoit', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM abouthowwedoit WHERE id=?'
    let data = [id]
    db.query(query, data, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatehowwedoit', upload.none(), function (req, res) {
    let id = req.body.id
    let idx = req.body.idx
    let header = req.body.header
    let query = 'UPDATE abouthowwedoit SET idx=?, header=? WHERE ID=?'
    let queryData = [idx, header, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addhowwedoit', upload.none(), function (req, res) {
    let idx = req.body.idx
    let header = req.body.header
    let query = 'INSERT INTO abouthowwedoit (idx, header) VALUES (?, ?)'
    let queryData = [idx, header]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;