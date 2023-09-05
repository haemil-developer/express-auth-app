const express = require('express');
const app = express();
const { default: mongoose } = require("mongoose");
const path = require('path');

const User = require("./models/users.model");

const cookieSession = require("cookie-session");
const passport = require("passport");

require('dotenv').config()

app.use(cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY]
}));
// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');
const {checkAuthenticated, checkNotAuthenticated} = require("./middlewares/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(`mongodb connected successfully`);
    }).catch((error) => {
        console.error(`mongodb connect error`)
    });

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index');
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
})

app.post('logout', (req,res, next) => {
    res.logOut(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    })
})

app.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup');
})

app.post('/signup', async (req, res) => {
    // create User object
    const user = new User(req.body);

    // save it in User Collection
    try {
        await user.save();
        return res.status(201).json({ success: true });
    } catch (e) {
        console.error(e);
    }
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) next(error);

        if(!user) return res.json({ msg: info });

        req.logIn(user, function (err) {
            if (err) return next(err);
            res.redirect('/');
        })
    })(req, res, next)
})

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
}));

const config = require('config');
const serverConfig = config.get('server');

const PORT = serverConfig.port;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})