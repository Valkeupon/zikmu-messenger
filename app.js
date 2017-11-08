const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const handlebarsHelpers = require('./helpers/handlebars');
const fs = require('fs');
const http = require('http');
const https = require('https');
const Bot = require('messenger-bot');
const request = require('request');
const config = require('config');
const musics = require('./collections/musiques');
const async = require('async');

const routes = require('./routes/index');
const admin = require('./routes/admin');

let app = express();

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: handlebarsHelpers
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());

const VALIDATION_TOKEN = "8bQ9470R9we90Jo8q4TcS85vCJa0vqCrpUM8LMoO";
const TOKEN = "EAAXkoGyQMgUBAMfLg5CAzB0zNFnlYPk9s4pUZCOZAED6Hq40O9mhqqWYFFfaOtiSv3PDbPnnejhZBy7ZAfv4ZAYBH6gpTKwmTPlj9VptMkZCHy4432dgDLNOD3itCoer8an8Qi2gKknjMqEvfIrAsKy5ieslVdoZAwdLHZC9cVDUxwZDZD";

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook/', function (req, res) {
    let message_events = req.body.entry[0].messaging
    for (message_event of message_events) {
        let sender = message_event.sender.id;
        if (message_event.message && message_event.message.text) {
             musics.aggregate({ $sample: { size: 1 } }).then(function(elem, err) {
                 if (err) return callback(err);

                 console.log(elem);
                 if(!elem){
                   return sendTextMessage(sender, "Aucune chanson trouvé");
                 }

                 sendTextMessage(sender, elem[0]);
             });
        }
    }
    res.sendStatus(200)
});

function sendTextMessage(sender, elem) {
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
              "default_action": {
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
              },
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://petersfancybrownhats.com",
                  "title":"View Website"
                },{
                  "type":"postback",
                  "title":"Start Chatting",
                  "payload":"DEVELOPER_DEFINED_PAYLOAD"
                }
              ]
            }
          ]
        }
      };
    };

    let access_token = TOKEN;
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

function sendWaitWrite(sender) {
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
}

//uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Homepage
app.use('/', routes);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
console.log("ENV --->", app.get('env'));
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
