const server = require('./bin/www');

// Libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

// allow cross region
var cors=require("cors")

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// The router to test whether the API works
var testAPIRouter = require("./routes/testAPI")
// The router to send default username and password
var testLoginRouter = require("./routes/testLogin")
// The login router for practicing and testing
var loginRouter = require("./routes/login")
// The replay router
var replayRouter = require('./routes/replay')
// The create account router
var createAccountRouter = require('./routes/createAccount')
// The score router
var scoreRouter = require('./routes/score')
// The leaderboard router
var leaderBoardRouter = require('./routes/leaderBoard')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// allow cross region and allow the credentials from our frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Apply session to our backend so that we know which user has login
// The session is implemented with cookie
app.use(session({
  secret: 'default-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie:{secure: true, maxAge:60000,sameSite:'none',httpOnly:true},
}));

// Use the logger, json, urlencoded, cookieParser, and static middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Use the test API router
app.use("/testAPI",testAPIRouter);
// Use the test login router
app.use("/testLogin",testLoginRouter);
// Use the login router
app.use("/Login",loginRouter);
// Use the replay router
app.use("/replay",replayRouter);
// Use the create account router
app.use("/CreateAccount",createAccountRouter);
// Use the score router
app.use("/Score", scoreRouter);
// Use the leaderBoard router
app.use("/LeaderBoard", leaderBoardRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
