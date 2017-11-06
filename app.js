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

//Certificat SSL
const privateKey  = fs.readFileSync("/etc/letsencrypt/archive/api.zikmu-app.fr/privkey1.pem");
const certificate = fs.readFileSync("/etc/letsencrypt/archive/api.zikmu-app.fr/fullchain1.pem");
const ca = fs.readFileSync("/etc/letsencrypt/archive/api.zikmu-app.fr/chain1.pem");

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

//BOT MESSENGER
let bot = new Bot({
   token: "EAAcJ3Lw2pikBAF5vjHiPpxDtXGoNjplTuStVZCbjqQ2gQa78ZBcgyhq6Q3ZCB8VSvv4NMR8b8XIgTj8uCUJ2TzjxcvZACUf4lEen2PoKG4QPIxbJqB8aAybPEfS06V6LWUJ43ZATZCwEV0HOzGJ0E8VHAqn2lDrhXHYxEGNOGZAZBAZDZD",
   verify: "8bQ9470R9we90Jo8q4TcS85vCJa0vqCrpUM8LMoO"
});
//LOG ERROR
bot.on('error', function(err){
   console.log('BOT ERROR', err.message)
});

bot.on('message', (payload, reply) => {
    let text = payload.message.text
    reply({
        text
    }, (err) => {
        if (err) {
            console.log('BOT ERR -->', err.message)
        }

        console.log(`Echoed back : ${text}`)
    })
});

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bot.middleware());


//Homepage
app.use('/', routes);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

const httpServer = http.createServer(app);
httpServer.listen(8080);

https.createServer({
        key: privateKey,
        cert: certificate,
        ca: ca
}, app).listen(443);

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
