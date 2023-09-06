const express = require('express');
const passport = require("passport");
const User = require("../models/users.model");
const {checkAuthenticated, checkNotAuthenticated} = require("../middlewares/auth");
const sendMail = require("../mail/mail");
const mainRouter = express.Router();

mainRouter.get('/', checkAuthenticated, (req, res) => {
    res.render('index');
})

mainRouter.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
})

mainRouter.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup');
})

mainRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) next(error);

        if(!user) return res.json({ msg: info });

        req.logIn(user, function (err) {
            if (err) return next(err);
            res.redirect('/');
        })
    })(req, res, next)
})

mainRouter.post('/logout', (req, res, next) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    })
})

mainRouter.post('/signup', async (req, res) => {
    // create User object
    const user = new User(req.body);

    // save it in User Collection
    try {
        await user.save();
        // send welcome email
        sendMail('receiver email', 'receiver name', 'welcome');
        return res.redirect('/login');
    } catch (e) {
        console.error(e);
    }
})

module.exports = mainRouter;