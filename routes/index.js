var express = require('express');
var router = express.Router();

var crypto = require('crypto');

User = require('../models/user');
Task = require('../models/task');
Tasklist = require('../models/tasklist');

/* GET home page. */
router.get('/', function(req, res) {
  Task.getAll(null, function(err, tasks){
    if (err){
      tasks = [];
    }
    res.render('index', {
      title: 'Leetodos',
      user: req.session.user,
      tasks: tasks,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/signin', function(req, res){
  Task.getAll(null, function(err, tasks){
    if (err){
      tasks = [];
    }
    res.render('signin', {
      title: 'signin',
      user: req.session.user,
      tasks: tasks,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/signin', function(req, res){
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  User.get(req.body.email, function(err, user){
    if (!user){
      req.flash('error', 'The user does not exist!!');
      return res.redirect('/signin');
    }
    if (user.password != password){
      req.flash('error', 'Password mistake!!');
      return res.redirect('/signin');
    }
    req.session.user = user;
    req.flash('success', ' Login successful!');
    res.redirect('/');
  });
});

router.get('/join', function(req, res){
  Task.getAll(null, function(err, tasks){
    if (err){
      tasks = [];
    }
    res.render('join', {
      title: 'join',
      user: req.session.user,
      tasks: tasks,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/join', function(req, res){
  var email = req.body.email,
      password = req.body.password,
      confirm = req.body.confirm;
  if (confirm != password){
    req.flash('error', 'Two input password is not consistent!');
    return res.redirect('/join');
  }
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
    email: req.body.email,
    password: password
  });
  User.get(newUser, function(err, user){
    if (user){
      req.flash('error', 'User already exists!');
      return res.redirect('/join');
    }
    newUser.save(function(err, user){
      if (err){
        req.flash('error', err);
        return res.redirect('/join');
      }
      req.session.user = user;
      req.flash('success', "Registered successfully!");
      res.redirect('/');
    });
  });
});

router.get('/logout', function(req, res){
  req.session.user = null;
  req.flash('success', 'Exit the success!');
  res.redirect('/');
});

router.get('/newlist', function(req, res){
  Task.getAll(null, function(err, tasks){
    if (err){
      tasks = [];
    }
    res.render('newlist', {
      title: 'newlist',
      user: req.session.user,
      tasks: tasks,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/newlist', function(req, res){
  var currentUser = req.session.user,
      task = new Task(currentUser.email, req.body.taskName);
  task.save(function(err){
    if (err){
      req.flash('error', err);
      return res.redirect('/newlist');
    }
    req.flash('success', ' Creating a successful!');
    res.redirect('/');
  })
});

router.get('/u/:name/:taskName', function(req, res){
  Task.getAll(null, function(err, tasks){
    if (err){
      tasks = [];
    }
    Task.getOne(req.params.name, req.params.taskName, function(err, taskName){
      if (err){
        req.flash('error', err);
        return res.redirect('/');
      }
      Tasklist.getAll(req.params.taskName, function(err, tasklist){
        if (err){
          req.flash('error', err);
          return res.redirect('/');
        }
        res.render('list', {
          title: req.params.title,
          user: req.session.user,
          taskName: taskName,
          tasks: tasks,
          tasklist: tasklist,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
      });
    });
  });
});

router.post('/u/:name/:taskName', function(req, res){
  var currentUser = req.session.user,
      tasklist = new Tasklist(req.params.taskName, req.body.listname);
  tasklist.save(function(err){
    if (err){
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', ' Creating a successful!');
    res.redirect('/u/' + req.params.name + '/' + req.params.taskName);
  });
});

module.exports = router;

