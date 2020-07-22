var aws = require('aws-sdk')
aws.config.setPromisesDependency();
aws.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'us-east-2'
})

const s3 = new aws.S3({ apiVersion: '2006-03-01' })

module.exports = s3