var express = require('express')
var router = express.Router()
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs')
var { cloudinary } = require('../cloudinary')
const deleteFiles = require('./../mixins/deleteFiles');
// var s3 = require('../aws_s3')

// const params = {
//     ACL: 'public-read',
//     Bucket: 'falcnstuff',
//     Body: '',
//     Key: ''
// }

router.post('/image', upload.single('image'), function (req, res) {
    // const fileStream = fs.createReadStream(req.file.path)
    // fileStream.on('error', function (err) { console.log('File Error', err) })
    // params.Body = fileStream
    // params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
    // s3.upload(params, (err, data) => {
    //     if (err) { console.log("Error", err) }
    //     if (data) { res.send({ location: data.Location }) }
    // })

    cloudinary.uploader.upload(req.file.path, function (err, data) {
        if (err) { console.log("Error", err) }
        if (data) {
            deleteFiles([req.file]);
            res.send({ location: data.url })
        }
    })
})

module.exports = router;