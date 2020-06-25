var express = require('express')
var router = express.Router();
var db = require('../db')

router.get('/aboutus', function (req, res) {

    let query = 'SELECT * FROM a_aboutus'

    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.post('/updateaboutus', function(req, res) {
    let content = req.body.content

    let query = 'UPDATE a_aboutus SET content=\'' + content + '\''

    db.query(query, function(err, rows) {
        if (err) throw err
        res.send(rows)
    })  
})

module.exports = router;