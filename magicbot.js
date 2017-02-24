var request = require('superagent');
var answerBuilder = require('./answer-builder');

module.exports = function(req, res, next){
  var username = req.body.user_name,
      text = req.body.text,
      mtgApiPath = "https://api.deckbrew.com/",
      singleCardPath = "mtg/cards/",
      payload = {};
  payload.channel = req.body.channel_id;
  if (text != null) {
    debugger
    searchterm = text.trim().toLowerCase().replace(/\s/g, "-")
    var apiCardpath = mtgApiPath + singleCardPath + searchterm;
		request.get(apiCardpath)
     .ok((res) => (res.status < 400 || res.status === 404))
     .then((result) => {
       if(result.status !== 404){
         var card = JSON.parse(result.text);
         var reply = answerBuilder.cardReply(card);
         postToSlackWebHook(reply, () => {
           return res.status(200).end();
         });
       } else if (text.length >= 4) {
         answerBuilder.suggestionReply(text)
           .then(reply => {
             console.log('fail', reply);
             postToSlackWebHook(reply, () => {
               return res.status(200).end();
             });
           })
           .catch(e => next(e));
       } else {
         postToSlackWebHook(`:sweat: Could not find a card named: ${text}`, () => {
           return res.status(200).end();
         });
       }
     }).catch(error => next(error));
  } else {
    return res.status(200).end();
  }
};

function postToSlackWebHook(reply, callback){
    var url = process.env.INCOMING_WEB_HOOK || "http://localhost:3000/swallowthepost";
    var payload = {text: reply};
    request.post(url)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(payload))
      .then(() => {
          callback();
        })
      .catch(e => {
        callback();
      });
}
