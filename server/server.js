const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

// not in use yet
const passport = require('passport');
// const passportLocal = require('passport-local');


const cookieParser = require('cookie-parser');
const session = require('express-session');


// using currently
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

var app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// POST routes
app.post('/users/', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    
    user.save().then(() => {
        return user.generateAuthToken();
        // returns token
    }).then((token) => {
        // add user data to the factory?
        // res.header('x-auth', token).send(user);
        // then send page
        res.header('x-auth', token).sendFile(path.join(__dirname, '..', 'public', 'views', 'welcome.html'));
        // res.header('x-auth', token).sendFile(path.join(__dirname, '..', 'public', 'views', 'welcome.html'));
        // res.header('x-auth', token).render(path.join(__dirname, '..', 'public', 'views', 'welcome.hbs'), user);

        // res.header('x-auth', token).send(user);     // sending back user data, need to use that user object
    }).catch((err) => {
        // try to send error along
        // send error code
        res.status(400).send(err);
        // res.status(400).send(path.join(__dirname, '..', 'public', 'views', 'error.html'));
        // res.status(400).render(path.join(__dirname, '..', 'public', 'views', 'error.hbs'));
    });
});
app.get('/users/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'welcome.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'signup.html'));
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};