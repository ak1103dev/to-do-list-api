const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const auth = require('./middlewares/auth');

const app = express();
const port = config.get('port');

mongoose.Promise = global.Promise;
mongoose.connect(config.get('mongoUrl'), {
  useMongoClient: true,
});

app.use(morgan('dev'));
app.use(cors())
app.use(bodyParser.json());
app.use(auth);
app.use('/', routes);

app.listen(port , () => console.log(`listen on port ${port}`));
