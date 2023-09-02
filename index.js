const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretText = 'secretText';
const refreshSecretText = 'refreshSecretText';

const posts = [
    {
        username: 'Alice',
        title: 'Wonder Land'
    },
    {
        username: 'Harry',
        title: 'Hogwarts'
    }
]
let refreshTokens = [];

app.use(express.json());

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    // create token using jwt   payload + secretText
    // add expiration date
    const accessToken = jwt.sign(user, secretText, { expiresIn: '2h' });

    // create refreshToken using jwt
    const refreshToken = jwt.sign(user, refreshSecretText, { expiresIn: '1day' });
    refreshTokens.push(refreshToken);   // usually using a database but in this project using memory store as simple

    // set refreshToken in cookie
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.json({ accessToken: accessToken });
})

app.get('/posts', authMiddleware, (req, res) => {
    res.json(posts);
})

function authMiddleware(req, res, next) {
    // get token from request header
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);  // Unauthorized

    // verify token
    jwt.verify(token, secretText, (error, user) => {
        if (error) return res.sendStatus(403);  // Forbidden
        req.username = user;
        next();
    })
}

const port = 3000;
app.listen(port, () => {
    console.log('listening on port ' + port);
})