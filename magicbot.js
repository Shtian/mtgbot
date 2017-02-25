const request = require('superagent');
const answerBuilder = require('./answer-builder');

module.exports = function(req, res, next){
  const text = req.body.text;
  const mtgApiPath = 'https://api.deckbrew.com/';
  const singleCardPath = 'mtg/cards/';
  const payload = { channel: req.body.channel_id };
  if (text) {
    let searchterm = text.trim().toLowerCase().replace(/\s/g, '-');
    searchterm = searchterm.replace(/'/g, '');
    const apiCardpath = mtgApiPath + singleCardPath + searchterm;
    request.get(apiCardpath)
     .ok((res) => (res.status < 400 || res.status === 404))
     .then((result) => {
       if(result.status !== 404){
         const card = JSON.parse(result.text);
         payload.text = answerBuilder.cardReply(card);
         postToSlackWebHook(payload, () => {
           return res.status(200).end();
         });
       } else if (text.length >= 4) {
         answerBuilder.suggestionReply(text)
           .then((reply) => {
             payload.text = reply;
             postToSlackWebHook(payload, () => {
               return res.status(200).end();
             });
           })
           .catch((e) => next(e));
       } else {
         postToSlackWebHook(`:sweat: Could not find a card named: ${text}`, () => {
           return res.status(200).end();
         });
       }
     }).catch((error) => {
       return next(error);
     });
  }
  return res.status(200).end();
};

function postToSlackWebHook(payload, callback){
  const url = process.env.INCOMING_WEB_HOOK || 'http://localhost:3000/swallowthepost';
  request.post(url)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(payload))
    .then(() => {
      callback();
    })
    .catch((e) => {
      callback(e);
    });
}
