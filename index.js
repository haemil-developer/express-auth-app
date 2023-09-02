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

app.get('/posts', (req, res) => {
    res.json(posts);
})

const port = 3000;
app.listen(port, () => {
    console.log('listening on port ' + port);
})