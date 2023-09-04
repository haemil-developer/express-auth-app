const passport = require('passport');
const User = require("../models/users.model");
const e = require("express");
const LocalStrategy = require('passport-local').Strategy;

// req.login(user)
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// clinet -> session -> reqeust
passport.deserializeUser((id, done)=> {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
})

passport.use( new LocalStrategy({ usernameField: 'email', passwordField: 'password'},
    (email, password, done) => {
        User.findOne({
            email: email.toLocaleLowerCase()
        }, (error, user) => {
            if (error) return done(error);

            if (!user) {
                return done(null, false, { msg: `Email ${email} not found` });
            }

            user.comparePassword(password, (err, isMatch) => {
                if (err) return done(null, user);

                if(isMatch) {
                    return done(null, user);
                }

                return done(null, false, { msg: `Invalid email or password` });
            });
        })
    }
))