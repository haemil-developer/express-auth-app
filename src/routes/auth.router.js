const express = require('express');
const passport = require("passport");
const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google'));

authRouter.get('/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
}));

authRouter.get('/kakao', passport.authenticate('kakao'));

authRouter.get('/kakao/callback', passport.authenticate('kakao', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = authRouter;