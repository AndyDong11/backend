var express = require('express')
var router = express.Router();
var db = require('../db')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

/** summary */
router.get('/getsummary', function (req, res) {
    let query = 'SELECT * FROM footersummary'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatesummary', upload.none(), function (req, res) {
    let { summary } = req.body
    let query = 'UPDATE footersummary SET summary=?'
    let queryData = [summary]
    console.log(summary)
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

/** services */
router.get('/getservices', function (req, res) {
    let query = 'SELECT * FROM footerservices'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/servicescount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM footerservices WHERE service LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/servicesonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM footerservices WHERE service LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deleteservice', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM footerservices WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addservice', upload.none(), function (req, res) {
    let { service, link } = req.body
    let query = 'INSERT INTO footerservices (service, link) VALUES (?, ?)'
    let queryData = [service, link]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getservice', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM footerservices WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateservice', upload.none(), function (req, res) {
    let { id, service, link } = req.body
    let query = 'UPDATE footerservices SET service=?, link=? WHERE id=?'
    let queryData = [service, link, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

/** contact info */
router.get('/getcontact', function (req, res) {
    let query = 'SELECT * FROM footercontact'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatecontact', upload.none(), function (req, res) {
    let { addressIcon, address, businessHoursIcon, businessHours, phoneNumberIcon, phoneNumber, contactEmailIcon, contactEmail } = req.body
    let query = 'UPDATE footercontact set addressIcon=?, address=?, businessHoursIcon=?, businessHours=?, phoneNumberIcon=?, phoneNumber=?, contactEmailIcon=?, contactEmail=?'
    let queryData = [addressIcon, address, businessHoursIcon, businessHours, phoneNumberIcon, phoneNumber, contactEmailIcon, contactEmail]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;