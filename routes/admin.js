var express = require('express');
var router = express.Router();
var async = require('async');
var users = require('../collections/users');
var musics = require('../collections/musiques');
var groupes = require('../collections/groupes');
var styles = require('../collections/styles');
var sess;

  //display login page
  router.get('/', function(req, res, next) {
    sess = req.session;
    console.log("SESSION ---> ", sess);
    //check if user is login
    if(sess.email) {
      res.render('admin/main');
    }
    else {
      res.render('admin/login');
    }
  });

  router.post('/login',function(req,res){
    sess = req.session;
    //check if users is in BDD and status = admin
    users.findOne({ email: req.body.email, password: req.body.password, archived: false, status: "admin" }, function(err, user){
      if(err){
        return console.log("USERS NOT IN BDD");
      }
      if(!user){
        res.redirect('/admin');
      }else{
        sess.email=req.body.email;
        res.redirect('/admin');
      }
    });
  });

  router.post('/logout',function(req,res){
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });
  //display page music
  router.get('/music', function(req, res, next) {
    sess = req.session;
    var data = {};

    if(sess.email) {
      var tasks = [
         function(callback) {
             musics.find({ archived: false }).then(function(elem, err) {
                 if (err) return callback(err);
                 data.musics = elem;
                 callback();
             });
         },
         function(callback) {
             groupes.find({ archived: false }).then(function(elem, err) {
                 if (err) return callback(err);
                 data.groupes = elem;
                 callback();
             });
         }
       ];
       async.parallel(tasks, function(err) {
          if (err) return next(err);
          res.render('admin/music', {
            items: data.musics,
            groupes: data.groupes,
          });
      });
    }
    else {
      res.redirect('/admin');
    }
  });
  //Action insert musics
  router.post('/music/insert-music', function(req, res, next) {
    if(!req.body.title || !req.body.url || !req.body.author || !req.body.style){
      return;
    }
    var item = {
      title: req.body.title,
      url: req.body.url,
      styles: [req.body.style],
    };

    var tasks = [
       function(callback) {
           groupes.findOne({ _id: req.body.author, archived: false }).then(function(elem, err) {
               if (err) return callback(err);
               item.author = {
                 _id: elem._id,
                 name: elem.title,
               }
               callback();
           });
       }
     ];

    async.parallel(tasks, function(err) {
       if (err) return next(err);
       console.log("INSERT ----> ", item );
       var data = new musics(item);
       data.save();
       res.redirect('/admin/music');
   });
  });
  //display update music page
  router.get('/music/update-music/:_id', function(req, res, next) {
    var id = req.params._id;

    musics.find({ _id: id })
        .then(function(doc) {
          if(!doc || doc.length <= 0){
            res.redirect('/admin/music');
          }else{
            res.render('admin/music-update',  { music: doc });
          }
      });
  });
  //action update music
  router.post('/music/update-music-action', function(req, res, next) {
    var id = req.body._id;

    musics.findById(id, function(err, doc) {
      if (err) {
        console.error('error, no entry found');
      }
      doc.title = req.body.title;
      doc.url = req.body.url;
      doc.author = req.body.author;
      doc.style = req.body.style;
      doc.save();
    })
    res.redirect('/admin/music')
  });
  //action delete music
  router.post('/music/delete-music-action', function(req, res, next) {
    var id = req.body._id;

    musics.findById(id, function(err, doc) {
      if (err) {
        console.error('error, no entry found');
      }
      doc.archived = true;

      doc.save();
    })
    res.redirect('/admin/music');
  });
  //display page groupe
  router.get('/groupes', function(req, res, next) {
    sess = req.session;
    if(sess.email) {
      groupes.find({ archived: false })
          .then(function(doc) {
            res.render('admin/groupes', {items: doc});
        });
    }
    else {
      res.redirect('/admin');
    }
  });
  //Action insert groupes
  router.post('/groupes/insert-groupe', function(req, res, next) {
    if(!req.body.title){
      return;
    }

    var item = {
      title: req.body.title,
    };

    console.log("INSERT ----> ", item );

    var data = new groupes(item);
    data.save();

    res.redirect('/admin/groupes');
  });
  //display update groupes page
  router.get('/groupes/update-groupe/:_id', function(req, res, next) {
    var id = req.params._id;

    groupes.find({ _id: id })
        .then(function(doc) {
          if(!doc || doc.length <= 0){
            res.redirect('/admin/groupes');
          }else{
            res.render('admin/groupe-update',  { groupe: doc });
          }
      });
  });
  //action update groupes
  router.post('/groupes/update-groupe-action', function(req, res, next) {
    var id = req.body._id;

    groupes.findById(id, function(err, doc) {
      if (err) {
        console.error('error, no entry found');
      }
      doc.title = req.body.title;

      doc.save();
    })
    res.redirect('/admin/groupes')
  });
  //action delete music
  router.post('/groupes/delete-groupe-action', function(req, res, next) {
    var id = req.body._id;

    groupes.findById(id, function(err, doc) {
      if (err) {
        console.error('error, no entry found');
      }
      doc.archived = true;

      doc.save();
    })
    res.redirect('/admin/groupes');
  });


    //display page styles
    router.get('/styles', function(req, res, next) {
        sess = req.session;
        if(sess.email) {
            groupes.find({ archived: false })
                .then(function(doc) {
                    res.render('admin/styles', {items: doc});
                });
        }
        else {
            res.redirect('/admin');
        }
    });
    //action insert styles
    router.post('/styles/insert-style', function(req, res, next) {
        if(!req.body.title){
            return;
        }

        var item = {
            title: req.body.title,
        };

        console.log("INSERT ----> ", item );

        var data = new styles(item);
        data.save();

        res.redirect('/admin/styles');
    });
  module.exports = router;
