const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretText = 'secretText';

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

app.use(express.json());

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    // create token using jwt   payload + secretText
    const accessToken = jwt.sign(user, secretText);
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