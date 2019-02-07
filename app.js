const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

//app dependencies 
const db = require('./api/config/database');

//Initialization
db.MY_CONNECTION();

//Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.use(cors());

//Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads'));

//Routes
app.use('/api/products', require('./api/routes/products'));
app.use('/api/orders', require('./api/routes/orders'));
app.use('/api/user', require('./api/routes/user'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;