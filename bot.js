const request = require('request');
const config = require('config');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const bodyParser = require('body-parser');
var users = require('./collections/users');

const TOKEN = "EAAXkoGyQMgUBAMfLg5CAzB0zNFnlYPk9s4pUZCOZAED6Hq40O9mhqqWYFFfaOtiSv3PDbPnnejhZBy7ZAfv4ZAYBH6gpTKwmTPlj9VptMkZCHy4432dgDLNOD3itCoer8an8Qi2gKknjMqEvfIrAsKy5ieslVdoZAwdLHZC9cVDUxwZDZD";

module.exports = {
  sendTextMessage: (sender, elem) => {
      let data = {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
               {
                "title": elem.title + ' - ' + elem.author.name,
                "image_url":"https://petersfancybrownhats.com/company_image.png",
                "subtitle":"Profite de ce morceau mon gars !",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://api.zikmu-app.fr/",
                    "title":"View Website"
                  },{
                    "type":"postback",
                    "title":"Inscription",
                    "payload": sender
                  }
                ]
              }
            ]
          }
        }
      };
      let access_token = TOKEN;
      request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: access_token},
          method: 'POST',
          json: {
              recipient: {id: sender},
              message: data,
          }
      }, function(error, response, body) {
          if (error) {
              console.log('Error sending messages: ', error)
          } else if (response.body.error) {
              console.log('Error: ', response.body.error)
          }
      })
  },
  signUpProfile: (sender) => {
      let access_token = TOKEN;
      let usersPublicProfile = 'https://graph.facebook.com/v2.6/' + sender + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + access_token;
      request({
          url: usersPublicProfile,
          method: 'GET',
          json: true // parse
      }, function (error, response, body) {
          if(error){
            console.log('ERROR -->', error);
          }
          console.log('Hi ' + body);
          users.findOne({ archived: false, messengerId: sender }).then(function(doc) {
            if(doc){
              return console.log('Utilisateur inscrit');
            }else{
              users.insert({
                firstName: first_name,
                lastName: last_name,
                picture: profile_pic,
                messengerId: sender
              });
            }
          });
      });
  },
  sendWaitWrite: (sender) => {
      let access_token = TOKEN;
      request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: access_token},
          method: 'POST',
          json: {
              recipient: {id:sender},
              sender_action: 'typing_on'
          }
      }, function(error, response, body) {
          if (error) {
              console.log('Error sending messages: ', error)
          } else if (response.body.error) {
              console.log('Error: ', response.body.error)
          }
      })
  },

};
