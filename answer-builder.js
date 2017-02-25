const request = require('superagent');

const answerBuilder = () => {
  const cardReply = (card) => {
    return `*Card name:* ${card.name}
*Text:* ${card.text}
*Image:* ${card.editions[0].image_url}`;
  };

  const suggestionReply = (text) => {
    return new Promise((resolve, reject) => {
      const words = text.split(' ');
      let searchterm = '';
      if(words.length > 1){
        searchterm = words[0];
      } else if(words[0].length >= 4){
        searchterm = words[0].substring(0, Math.ceil(text.length/2));
      } else {
        resolve(`:thinking_face: Could not find the card you were looking for: ${text}`);
      }
      const url = `https://api.deckbrew.com/mtg/cards/typeahead?q=${searchterm}`;
      request.get(url).then((result) => {
        const cards = JSON.parse(result.text);
        if(cards.length === 0){
          resolve(`:thinking_face: Could not find the card you were looking for: ${text}`);
        }
        const foundCards = cards.map((item) => {
          return {name: item.name, url: item.editions[0].html_url};
        });
        let reply = `:thinking_face: Could not find *${text}*. Did you mean:`;
        foundCards.forEach((c) => {
          reply += `\n<${c.url}|${c.name}>`;
        });
        resolve(reply);
      }, (error) => {
        reject(error);
      });
    });
  };

  return {
    cardReply,
    suggestionReply
  };
};

module.exports = answerBuilder();
