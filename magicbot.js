var request = require('request');

module.exports = function(req, res, next){
  var username = req.body.user_name,
      text = req.body.text,
      mtgApiPath = "https://api.deckbrew.com/",
      singleCardPath = "mtg/cards/",
      payload = {};
  payload.channel = req.body.channel_id;

  if (text != null) {
    searchterm = text.trim().toLowerCase().replace(/\s/g, "-")
    var apiCardpath = mtgApiPath + singleCardPath + searchterm;
    request.get(apiCardpath, function(error, result, body){
      if (error) {
        return next(error);
      } else if (result.statusCode == 200 || result.statusCode == 404) {
        var parsedBody = JSON.parse(body);
        payload.text = result.statusCode == 404 ? "Sorry, could not find a card by that name."
                                                : "Card name: " + parsedBody.name +
                                                  "\nText: " + parsedBody.text +
                                                  "\nImage: " + parsedBody.editions[0].image_url;
        console.log(payload);
        postToSlackWebHook(payload, function (error, status, body) {
          if (error) {
            return next(error);
          } else if (status !== 200) {
            return next(new Error('Incoming WebHook: ' + status + ' ' + body));
          } else {
            return res.status(200).end();
          }
        });
      } else {
          return next(new Error('Incoming WebHook: ' + result.statusCode + ' ' + body));
      }
    });
  } else {
    return res.status(200).end();
  }
};

function postToSlackWebHook(payload, callback){
    var path = process.env.INCOMING_WEB_HOOK || "http://localhost:3000/swallowthepost";
    request({
      uri: path,
      method: 'POST',
      body: JSON.stringify(payload)
    }, function(error, response, body){
      if(error){
        return callback(error)
      }

      callback(null, response.statusCode, body);
    });
}
