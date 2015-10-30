module.exports = function(req, res, next){
  console.log(req.body);
  var userName = req.body.user_name;
  var text = 'Hello, ' + userName + '!';

  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).send(text);
  } else {
    return res.status(200).end();
  }
};
