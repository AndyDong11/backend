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

router.post('/', upload.array('attachments'), function (req, res) {

    const name = req.body.name
    const email = req.body.email
    const subject= req.body.subject
    const message = req.body.message

    var mailOptions = {
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: name + ' : ' + subject,
        html: "<table border=\'1\'>" + 
                "<tr><th>Name</th><td>" + name + "</td></tr>" + 
                "<tr><th>Email</th><td>" + email + "</td></tr>" +
                "<tr><th>Subject</th><td>" + subject + "</td></tr>" +
                "<tr><th>Message</th><td>" + message + "</td></tr>" + 
              "</table>",
        attachments: []
    };

    req.files.forEach(file => mailOptions.attachments.push({filename: file.originalname, path: file.path}))

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw error
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Success')
        }
    });

});


module.exports = router;