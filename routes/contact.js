const deleteFiles = require('../mixins/deleteFiles');
const capitalize = require('../mixins/capitalize');
var express = require('express')
var router = express.Router();
var multer = require('multer')
var nodemailer = require('nodemailer');

var upload = multer({ dest: 'uploads/' })

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS
    }
});
var fs = require('fs');

router.post('/', upload.array('attachments'), function (req, res) {

    const name = req.body.name
    const email = req.body.email
    const subject= req.body.subject
    const message = req.body.message

    let htmlTable = "<table border=\'1'\>"
    Object.keys(req.body).forEach((key) => {
        htmlTable += `<tr><th>${capitalize(key)}</th><td>${req.body[key]}</td></tr>`
    })
    htmlTable += "</table>"

    var mailOptions = {
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: name + ' : ' + subject,
        html: htmlTable,
        attachments: []
    };

    req.files.forEach(file => mailOptions.attachments.push({filename: file.originalname, path: file.path}))

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw error
        } else {
            console.log('Email sent: ' + info.response);
            deleteFiles(mailOptions.attachments);
            res.send('Success')
        }
    });



});


module.exports = router;