const passport = require('passport');
const User = require("../models/users.model");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStratey = require('passport-google-oauth20').Strategy;

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

const localStratgyConfig = new LocalStrategy({ usernameField: 'email', passwordField: 'password'},
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
)
passport.use('local', localStratgyConfig);

const googleClientId = 'google client id';
const googleClientSecret = 'google client secret';
const googleStrategyConfig = new GoogleStratey({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile']
}, (accessToken, refreshToken, profile, done) => {
    console.log('profile', profile);
    User.findOne({ googleId: profile.id }, (err, existingUser) => {
        if (err) return done(err);

        if (existingUser) {
            return done(null, existingUser);
        } else {
            const user = new User();
            user.email = profile.emails[0].value;
            user.googleId = profile.id;
            user.save((err) => {
                if(err) return done(err);
                done(null, user);
            })
        }
    })
})
passport.use('google', googleStrategyConfig );