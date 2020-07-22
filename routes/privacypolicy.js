var express = require('express')
var router = express.Router();
var db = require('../db')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

/** privacy policy */
router.get('/', function (req, res) {
    let query = 'SELECT * FROM privacypolicy'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows[0].content)  
    })
})

router.post('/updateprivacypolicy', upload.none(), function (req, res) {
    let content = req.body.content
    let query = 'UPDATE privacypolicy SET content=?'
    let queryData = [content]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

module.exports = router;