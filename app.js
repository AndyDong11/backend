require('dotenv').config()
var express = require('express');
var http = require('http');
var cors = require('cors')
var cookieParser = require('cookie-parser')
var session = require('express-session');
var db = require('db.js');
var MySQLStore = require('express-mysql-session')(session);

var user = require('./routes/user')
var services = require('./routes/services')
var industries = require('./routes/industries')
var homepage = require('./routes/homepage')
var about = require('./routes/about')
var blogs = require('./routes/blogs')
var news = require('./routes/news')
var sendMail = require('./routes/sendMail')
var faqs = require('./routes/faqs')
var privacypolicy = require('./routes/privacypolicy')
var careers = require('./routes/careers')
var upload = require('./routes/upload')
var footer = require('./routes/footer')

var app = express();

app.use(
    cors({
        origin: "http://localhost:3000", // restrict calls to this address
        credentials: true
    })
);

app.use(cookieParser())

app.use('/user', user)
app.use('/services', services)
app.use('/industries', industries)
app.use('/homepage', homepage)
app.use('/about', about)
app.use('/blogs', blogs)
app.use('/news', news)
app.use('/sendMail', sendMail)
app.use('/faqs', faqs)
app.use('/privacypolicy', privacypolicy)
app.use('/careers', careers)
app.use('/upload', upload)
app.use('/footer', footer)

http.createServer(app).listen(3001);