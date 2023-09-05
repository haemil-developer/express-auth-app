const express = require('express');
const passport = require("passport");
const googleAuthRouter = express.Router();

googleAuthRouter.get('/google', passport.authenticate('google'));

googleAuthRouter.get('/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = googleAuthRouter;