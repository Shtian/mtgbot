Magic the Gathering Slack Integration
===========

## Description

Slack integration that listens to a POST request at ```/card``` done by a Slash Command from Slack.

Text provided should be an exact name match for a Magic The Gathering card. The service then looks up the card info from api.deckbrew.com and POSTS the info back to a configured slack incoming webhook URL. Configuration variable name is ```INCOMING_WEB_HOOK``` and should contain the full webhook URL provided by slack.

## Development

After the repository has been cloned do a ```npm install```.

App can be started by either running ```node app.js``` or just ```npm start```.

Locally the response is not fed back to a slack webhook URL by default, it is just swallowed locally at a POST endpoint. Should you want to test it against a slack webhook url you can set the environment variable ```INCOMING_WEB_HOOK``` before runnning the app.
