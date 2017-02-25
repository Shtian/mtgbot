const express = require('express');
const bodyParser = require('body-parser');
const magicbot = require('./src/magicbot');

const app = express();
const port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// test route
app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});
app.post('/swallowthepost', (req, res) => {
  res.status(200).send('Thanks man');
});
app.post('/card', magicbot);

// error handler
app.use((err, req, res) => {
  res.status(500).send(err.message);
});

app.listen(port);
