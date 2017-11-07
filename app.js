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
//const Bot = require('messenger-bot');


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

app.set('port', process.env.PORT || 5555);
app.use(bodyParser.json());

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
if (app.get('env') !== 'development') {
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
