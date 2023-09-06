const express = require('express');
const app = express();
const { default: mongoose } = require("mongoose");
const path = require('path');

const config = require('config');
const mainRouter = require("./routes/main.router");
const googleAuthRouter = require("./routes/auth.router");
const serverConfig = config.get('server');

const PORT = serverConfig.port;

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

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

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

app.use('/', mainRouter);
app.use('/auth', googleAuthRouter);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})