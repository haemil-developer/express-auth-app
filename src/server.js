const express = require('express');
const app = express();
const { default: mongoose } = require("mongoose");
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(`mongodb+srv://<user>:<password>@nestcluster.dsujn3u.mongodb.net/`)
    .then(() => {
        console.log(`mongodb connected successfully`);
    }).catch((error) => {
        console.error(`mongodb connect error`)
    });

app.use('/static', express.static(path.join(__dirname, 'pubilc')))

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

const port = 4000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
})