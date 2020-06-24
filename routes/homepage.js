var express = require('express')
var router = express.Router();
var db = require('../db');
const e = require('express');

/**************************************************************
*************************** WEBSITE ***************************
**************************************************************/

router.get('/banner', function (req, res) {
    db.query('SELECT * FROM homepagebanner', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});
    
router.get('/services', function (req, res) {
    db.query('SELECT * FROM homeservices', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/whatwedo', function (req, res) {
    db.query('SELECT * FROM whatwedo', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/clients', function (req, res) {
    db.query('SELECT * FROM clients', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/aboutus', function (req, res) {
    db.query('SELECT * FROM aboutus', function(err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

/**************************************************************
************************* ADMIN PANEL *************************
**************************************************************/

/** Banner */


/** Services */
router.get('/servicecount', function (req, res) {

    let searchCriteria = req.query.searchCriteria

    db.query('SELECT COUNT(*) FROM homeservices WHERE title LIKE \'%' + searchCriteria +'%\'', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/paginatedservices', function (req, res) {

    let itemsPerPage = req.query.itemsPerPage
    let currentPage = req.query.currentPage
    let searchCriteria = req.query.searchCriteria
    let offset = itemsPerPage*currentPage

    let query = 'SELECT * FROM homeservices WHERE title LIKE \'%' + searchCriteria +'%\' ORDER BY ID LIMIT ' + offset + ', ' + itemsPerPage

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});


router.post('/addservice', function(req, res) {
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content

    let query = 'INSERT INTO homeservices (icon, title, content) VALUES (\'' + icon +'\', \'' + title + '\', \'' + content +'\')'
    
    db.query(query, function(err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getservice', function(req, res) {

    let service = req.query.service

    let query = 'SELECT * FROM homeservices WHERE id=\'' + service + '\''

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateservice', function(req, res) {

    let id = req.body.id
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    

    let query = 'UPDATE homeservices SET icon=\'' + icon + '\', title=\'' + title + '\', content=\'' + content + '\' WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/deleteservice', function(req, res) {

    let id = req.body.id

    let query = 'DELETE FROM homeservices WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

/** CLIENTS */
router.get('/clientcount', function (req, res) {

    let searchCriteria = req.query.searchCriteria

    db.query('SELECT COUNT(*) FROM clients WHERE company LIKE \'%' + searchCriteria +'%\'', function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/paginatedclients', function (req, res) {

    let clientsPerPage = req.query.postsPerPage
    let currentPage = req.query.currentPage
    let searchCriteria = req.query.searchCriteria
    let offset = clientsPerPage*currentPage

    let query = 'SELECT * FROM clients WHERE company LIKE \'%' + searchCriteria +'%\' ORDER BY ID LIMIT ' + offset + ', ' + clientsPerPage

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/getclient', function(req, res) {
    let companyName = req.query.company
    let query = 'SELECT * FROM clients WHERE company=\'' + companyName + '\''
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateclient', function(req, res) {

    let companyName = req.body.name
    let updatedImage = req.body.updatedImage
    let image = req.body.image
    let id = req.body.id

    let query = 'UPDATE clients SET company=\'' + companyName + '\' WHERE id= ' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addclient', function(req, res) {

    let companyName = req.body.name
    let image = req.body.image

    let query = 'INSERT INTO clients (company) VALUES (\'' + companyName +'\')'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/deleteclient', function(req, res) {

    let id = req.body.id

    let query = 'DELETE FROM clients WHERE id=' + id
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})


module.exports = router;