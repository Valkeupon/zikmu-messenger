var express = require('express');
var router = express.Router();
var users = require('../collections/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  users.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/blog', function(req, res, next) {
  users.find()
      .then(function(doc) {
        res.render('blog', {items: doc});
      });
});


router.get('/get-data', function(req, res, next) {
  users.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.post('/insert', function(req, res, next) {
  var item = {
    email: req.body.email,
    password: req.body.password,
  };

  var data = new users(item);
  data.save();

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  var id = req.body.id;

  users.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.title = req.body.title;
    doc.content = req.body.content;
    doc.author = req.body.author;
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});


module.exports = router;
