const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const app = express();
const port = config.get('port');

app.use(bodyParser.json());
app.use('/', (req, res) => res.send('hello'));

app.listen(port , () => console.log(`listen on port ${port}`))