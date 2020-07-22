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

/** our services */
router.get('/', function (req, res) {
    let query = 'SELECT * FROM serviceservices'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/servicecount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM serviceservices WHERE title LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/servicesonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM serviceservices WHERE title LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/deleteservice', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM serviceservices WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addservice', upload.none(), function (req, res) {
    let icon = req.body.icon
    let sideIcon = req.body.sideIcon
    let title = req.body.title
    let content = req.body.content
    let query = 'INSERT INTO serviceservices (icon, sideIcon, title, content) VALUES (?, ?, ?, ?)'
    let queryData = [icon, sideIcon, title, content]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getservice', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM serviceservices WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateservice', upload.none(), function (req, res) {
    let id = req.body.id
    let icon = req.body.icon
    let sideIcon = req.body.sideIcon
    let title = req.body.title
    let content = req.body.content
    let query = 'UPDATE serviceservices SET icon=?, sideIcon=?, title=?, content=? WHERE id=?'
    let queryData = [icon, sideIcon, title, content, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

/** testimonials */
router.get('/gettestimonials', function (req, res) {
    let query = 'SELECT * FROM servicestestimonials'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/testimonialscount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM servicestestimonials WHERE clientName LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/testimonialsonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM servicestestimonials WHERE clientName LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deletetestimonial', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM servicestestimonials WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addtestimony', upload.none(), function (req, res) {
    let clientName = req.body.clientName
    let clientTitle = req.body.clientTitle
    let testimony = req.body.testimony
    let rating = req.body.rating
    let query = 'INSERT INTO servicestestimonials (clientName, clientTitle, testimony, rating) VALUES (?, ?, ?, ?)'
    let queryData = [clientName, clientTitle, testimony, rating]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/gettestimony', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM servicestestimonials WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatetestimony', upload.none(), function (req, res) {
    let id = req.body.id
    let clientName = req.body.clientName
    let clientTitle = req.body.clientTitle
    let testimony = req.body.testimony
    let rating = req.body.rating
    let query = 'UPDATE servicestestimonials SET clientName=?, clientTitle=?, testimony=?, rating=? WHERE id=?'
    let queryData = [clientName, clientTitle, testimony, rating, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

/** service details */
router.get('/getservicedetails', function (req, res) {
    let query = 'SELECT * FROM servicesservicedetails'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/servicedetailscount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM servicesservicedetails WHERE serviceTitle LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/servicedetailsonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM servicesservicedetails WHERE serviceTitle LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deleteservicedetail', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM servicesservicedetails WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addservicedetail', upload.single('image'), function (req, res) {
    let { serviceTitle, imageType, imageAlt, content } = req.body
    let query = 'INSERT INTO servicesservicedetails (serviceTitle, image, imageAlt, content) VALUES (?, ?, ?, ?)'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, data) => {
            if (err) { console.log("Error", err) }
            if (data) {
                let queryData = [serviceTitle, data.Location, imageAlt, content]
                db.query(query, queryData, function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        let queryData = [serviceTitle, req.body.image, imageAlt, content]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})

router.get('/getservicedetail', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM servicesservicedetails WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateservicedetail', upload.single('image'), function (req, res) {
    let { id, serviceTitle, imageType, imageAlt, content } = req.body
    let query = 'UPDATE servicesservicedetails SET serviceTitle=?, image=?, imageAlt=?, content=? WHERE id=?'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, data) => {
            if (err) { console.log("Error", err) }
            if (data) {
                let queryData = [serviceTitle, data.Location, imageAlt, content, id]
                db.query(query, queryData, function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        let queryData = [serviceTitle, req.body.image, imageAlt, content, id]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})


module.exports = router;