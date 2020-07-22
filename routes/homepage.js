var express = require('express')
var router = express.Router();
var db = require('../db');
var fs = require('fs')
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var s3 = require('../aws_s3')

const params = {
    ACL: 'public-read',
    Bucket: 'falcnstuff',
    Body: '',
    Key: ''
}

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

/** Banner */
router.get('/banner', function (req, res) {
    let query = 'SELECT * FROM homebanner'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/bannercount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM homebanner WHERE bannerHeadline LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/bannersonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM homebanner WHERE bannerHeadline LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/getbanner', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM homebanner WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deletebanner', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM homebanner WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/banner/add', upload.single('image'), function (req, res) {

    let = { bannerHeadline, imageType, imageAlt, buttonText, buttonLink } = req.body
    let query = 'INSERT INTO homebanner (bannerHeadline, image, imageAlt, buttonText, buttonLink) VALUES (?, ?, ?, ?, ?)'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, data) => {
            if (err) { console.log("Error", err) }
            if (data) {
                let queryData = [bannerHeadline, data.Location, imageAlt, buttonText, buttonLink]
                db.query(query, queryData, function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        let queryData = [bannerHeadline, req.body.image, imageAlt, buttonText, buttonLink]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})

router.post('/updatebanner', upload.single('image'), function (req, res) {
    let { id, bannerHeadline, imageType, imageAlt, buttonText, buttonLink } = req.body
    let query = 'UPDATE homebanner SET bannerHeadline=?, image=?, imageAlt=?, buttonText=?, buttonLink=? WHERE ID=?'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, data) => {
            if (err) { console.log("Error", err) }
            if (data) {
                let queryData = [bannerHeadline, data.Location, imageAlt, buttonText, buttonLink, id]
                db.query(query, queryData, function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        let queryData = [bannerHeadline, req.body.image, imageAlt, buttonText, buttonLink, id]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})

/** Services */
router.get('/services', function (req, res) {
    let query = 'SELECT * FROM homeservices'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/servicecount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM homeservices WHERE title LIKE ?'
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
    let query = 'SELECT * FROM homeservices WHERE title LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.post('/addservice', upload.none(), function (req, res) {
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    let query = 'INSERT INTO homeservices (icon, title, content) VALUES (?, ?, ?)'
    let queryData = [icon, title, content]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getservice', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM homeservices WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateservice', upload.none(), function (req, res) {
    let id = parseInt(req.body.id)
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    let query = 'UPDATE homeservices SET icon=?, title=?, content=? WHERE id=?'
    let queryData = [icon, title, content, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deleteservice', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM homeservices WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

/** about us */
router.get('/aboutus', function (req, res) {
    let query = 'SELECT * FROM homeaboutus'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateaboutus', upload.single('image'), function (req, res) {
    let { content, imageType, imageAlt, buttonText, buttonLink } = req.body
    let query = 'UPDATE homeaboutus SET content=?, buttonText=?, buttonLink=?, imageAlt=?, image=?'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, data) => {
            if (err) { console.log("Error", err) }
            if (data) {
                
                db.query(query, [content, buttonText, buttonLink, imageAlt, data.Location], function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        db.query(query, [content, buttonText, buttonLink, imageAlt, req.body.image], function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})

/** WHATWEDO */
router.get('/whatwedo', function (req, res) {
    let query = 'SELECT * FROM whatwedo'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/whatwedocount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM whatwedo WHERE title LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/whatwedoonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM whatwedo WHERE title LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/deletewhatwedo', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM whatwedo WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addwhatwedo', upload.none(), function (req, res) {
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    let query = 'INSERT INTO whatwedo (icon, title, content) VALUES (?, ?, ?)'
    let queryData = [icon, title, content]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/getwhatwedo', function (req, res) {
    let id = req.query.id
    let query = 'SELECT * FROM whatwedo WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatewhatwedo', upload.none(), function (req, res) {
    let id = req.body.id
    let icon = req.body.icon
    let title = req.body.title
    let content = req.body.content
    let query = 'UPDATE whatwedo SET icon=?, title=?, content=? WHERE id=?'
    let queryData = [icon, title, content, id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

/** CLIENTS */
router.get('/clients', function (req, res) {
    let query = 'SELECT * FROM homeclients'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/clientcount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM homeclients WHERE clientName LIKE ?'
    let queryData = [searchCriteria]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/clientsonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM homeclients WHERE clientName LIKE ? ORDER BY ID LIMIT ?, ?'
    let queryData = [searchCriteria, offset, itemsPerPage]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/getclient', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM homeclients WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deleteclient', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM homeclients WHERE id=?'
    let queryData = [id]
    db.query(query, queryData, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/addclient', upload.single('image'), function (req, res) {
    let clientName = req.body.clientName
    let imageType = req.body.imageType
    let imageAlt = req.body.imageAlt
    let imageLink = req.body.imageLink
    let query = 'INSERT INTO homeclients (clientName, image, imageLink, imageAlt) VALUES (?, ?, ?, ?)'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, data) => {
            if (err) { console.log("Error", err) }
            if (data) {
                let queryData = [clientName, data.Location, imageLink, imageAlt]
                db.query(query, queryData, function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        let queryData = [clientName, req.body.image, imageLink, imageAlt]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})

router.post('/updateclient', upload.single('image'), function (req, res) {
    let id = req.body.id
    let clientName = req.body.clientName
    let imageType = req.body.imageType
    let imageAlt = req.body.imageAlt
    let imageLink = req.body.imageLink
    let query = 'UPDATE homeclients SET clientName=?, image=?, imageLink=?, imageAlt=? WHERE ID=?'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, data) => {
            if (err) { console.log("Error", err) }
            if (data) {
                let queryData = [clientName, data.Location, imageLink, imageAlt, id]
                db.query(query, queryData, function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        let queryData = [clientName, req.body.image, imageLink, imageAlt, id]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})

/** Free Proposal */
router.get('/getfreeproposal', upload.none(), function (req, res) {
    let query = 'SELECT * FROM homefreeproposal'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updatefreeproposal', upload.array('images'), function (req, res) {
    let images = []
    for (let i = 0; i < req.files.length; i++) {
        images.push(read(req.files[i]))
    }
    Promise.all(images).then(async (imageURLs) => {
        let title = req.body.title
        let header = req.body.header
        let buttonText = req.body.buttonText
        let buttonLink = req.body.buttonLink
        let backgroundImageType = req.body.backgroundImageType
        let backgroundImage = req.body.backgroundImage
        let backgroundImageAlt = req.body.backgroundImageAlt
        let sideImageType = req.body.sideImageType
        let sideImage = req.body.sideImage
        let sideImageAlt = req.body.sideImageAlt
        if (backgroundImageType == 'Local') {
            backgroundImage = imageURLs[backgroundImage]
        }
        if (sideImageType == 'Local') {
            sideImage = imageURLs[sideImage]
        }
        const query = 'UPDATE homefreeproposal SET title=?, header=?, buttonText=?, buttonLink=?, backgroundImage=?, backgroundImageAlt=?, sideImage=?, sideImageAlt=?'
        const data = [title, header, buttonText, buttonLink, backgroundImage, backgroundImageAlt, sideImage, sideImageAlt]
        db.query(query, data, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }, reason => { console.log(reason) })
})

/** Awards */
router.get('/awards', function (req, res) {
    let query = 'SELECT * FROM homeawards'
    db.query(query, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/awardscount', function (req, res) {
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let query = 'SELECT COUNT(*) FROM homeawards WHERE awardName LIKE ?'
    let data = [searchCriteria]
    db.query(query, data, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/awardsonpage', function (req, res) {
    let itemsPerPage = parseInt(req.query.itemsPerPage)
    let currentPage = parseInt(req.query.currentPage)
    let searchCriteria = '%' + req.query.searchCriteria + '%'
    let offset = itemsPerPage * currentPage
    let query = 'SELECT * FROM homeawards WHERE awardName LIKE ? ORDER BY ID LIMIT ?, ?'
    let data = [searchCriteria, offset, itemsPerPage]
    db.query(query, data, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
});

router.get('/getaward', function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'SELECT * FROM homeawards WHERE id=?'
    let data = [id]
    db.query(query, data, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.get('/deleteaward', upload.none(), function (req, res) {
    let id = parseInt(req.query.id)
    let query = 'DELETE FROM homeawards WHERE id=?'
    let data = [id]
    db.query(query, data, function (err, rows) {
        if (err) throw err
        res.send(rows)
    })
})

router.post('/updateaward', upload.single('image'), function (req, res) {
    let id = req.body.id
    let awardName = req.body.awardName
    let imageType = req.body.imageType
    let imageAlt = req.body.imageAlt
    let imageLink = req.body.imageLink
    let query = 'UPDATE homeawards SET awardName=?, image=?, imageAlt=?, imageLink=? WHERE ID=?'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, img) => {
            if (err) { console.log("Error", err) }
            if (data) {
                let queryData = [awardName, data.Location, imageAlt, imageLink, id]
                db.query(query, queryData, function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        let data = [awardName, req.body.image, imageAlt, imageLink, id]
        db.query(query, data, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})

router.post('/addaward', upload.single('image'), function (req, res) {
    let awardName = req.body.awardName
    let imageType = req.body.imageType
    let imageAlt = req.body.imageAlt
    let imageLink = req.body.imageLink
    let query = 'INSERT INTO homeawards (awardName, image, imageAlt, imageLink) VALUES (?, ?, ?, ?)'
    if (imageType == 'Local') {
        const fileStream = fs.createReadStream(req.file.path)
        fileStream.on('error', function (err) { console.log('File Error', err) })
        params.Body = fileStream
        params.Key = req.file.filename + '-' + req.file.originalname.split('.')[0]
        s3.upload(params, (err, data) => {
            if (err) { console.log("Error", err) }
            if (data) {
                let queryData = [awardName, data.Location, imageAlt, imageLink]
                db.query(query, queryData, function (err, rows) {
                    if (err) throw err
                    res.send(rows)
                })
            }
        })
    }
    else {
        let queryData = [awardName, req.body.image, imageAlt, imageLink]
        db.query(query, queryData, function (err, rows) {
            if (err) throw err
            res.send(rows)
        })
    }
})


module.exports = router;