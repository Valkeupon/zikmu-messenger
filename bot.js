const request = require('request');
const config = require('config');
const bodyParser = require('body-parser');
const express = require('express');

let app = express();

const VALIDATION_TOKEN = "8bQ9470R9we90Jo8q4TcS85vCJa0vqCrpUM8LMoO";
const FB_TOKEN = "EAAXkoGyQMgUBAMfLg5CAzB0zNFnlYPk9s4pUZCOZAED6Hq40O9mhqqWYFFfaOtiSv3PDbPnnejhZBy7ZAfv4ZAYBH6gpTKwmTPlj9VptMkZCHy4432dgDLNOD3itCoer8an8Qi2gKknjMqEvfIrAsKy5ieslVdoZAwdLHZC9cVDUxwZDZD";

module.exports = {
  app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  });

  app.post('/webhook/', function (req, res) {
      let message_events = req.body.entry[0].messaging
      for (message_event of message_events) {
          let sender = message_event.sender.id
          if (message_event.message && message_event.message.text) {
              let text = message_event.message.text
              sendTextMessage(sender, "J'ai recu : " + text.substring(0, 200))
          }
      }
      res.sendStatus(200)
  });

  function sendTextMessage(sender, text) {
      let data = { text:text }
      let access_token = FB_TOKEN;
      request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: access_token},
          method: 'POST',
          json: {
              recipient: {id:sender},
              message: data,
          }
      }, function(error, response, body) {
          if (error) {
              console.log('Error sending messages: ', error)
          } else if (response.body.error) {
              console.log('Error: ', response.body.error)
          }
      })
  }
}
