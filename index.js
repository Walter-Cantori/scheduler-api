const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

if (process.env.NODE_ENV !== 'production') {
  const envPath = process.env.NODE_ENV
    ? `.env.${process.env.NODE_ENV}`
    : '.env';
  require('dotenv').config({ path: envPath });
}

const { url, modelsPath } = require('./config/databse');

mongoose.connect(url);
requireDir(modelsPath);

app.use(bodyParser.json());

app.use('/api', require('./src/routes'));

const port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;
