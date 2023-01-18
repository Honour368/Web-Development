var cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');

// use assignment2 db
var monk = require('monk');
var db = monk('127.0.0.1:27017/assignment2');

var notesRouter = require('./routes/notes');
// var usersRouter = require('./routes/users');

var NoteService = express();
NoteService.use(cors());

// view engine setup
NoteService.set('views', path.join(__dirname, 'views'));
NoteService.set('view engine', 'pug');

NoteService.use(logger('dev'));
NoteService.use(express.json());
NoteService.use(express.urlencoded({ extended: false }));
NoteService.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to routers 
NoteService.use(function(req,res,next){
  req.db = db; 
	next();
});

// use session middleware
NoteService.use(session({
  secret: 'random_string_goes_here', 
  resave: false,
  saveUninitialized: true
}));

NoteService.options('*', cors());
NoteService.use('/', notesRouter);
// NoteService.use('/users', usersRouter);

// for requests not matching the above routes, create 404 error and forward to error handler
NoteService.use(function(req, res, next) {
    next(createError(404));
});

// error handler
NoteService.use(function(err, req, res, next) {
  // set locals, only providing error in development environment
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// module.exports = NoteService;
NoteService.listen(3001);
