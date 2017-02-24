var express = require('express');
var bodyParser = require('body-parser');
var magicbot = require('./magicbot');

var app = express();
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// test route
app.get('/', function (req, res) { res.status(200).send('Hello world!') });
app.post('/swallowthepost', function (req, res) { res.status(200).send('Thanks man') });
app.post('/card', magicbot);

// error handler
app.use(function (err, req, res, next) {
  res.status(500).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});
