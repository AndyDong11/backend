var express = require('express');
var http = require('http');
var cors = require('cors')
const formData = require('express-form-data')

var services = require('./routes/services')
var industries = require('./routes/industries')
var homepage = require('./routes/homepage')
var blogs = require('./routes/blogs')
var news = require('./routes/news')

var app = express();

app.use(
    cors({
        origin: "http://localhost:3000", // restrict calls to those this address
    })
);

app.use(formData.parse())
app.use('/services', services)
app.use('/industries', industries)
app.use('/homepage', homepage)
app.use('/blogs', blogs)
app.use('/news', news)

http.createServer(app).listen(3001);