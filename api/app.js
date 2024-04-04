const server = require('./bin/www');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// allow cross region
var cors=require("cors")

// !!
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// The router to test whether the API works
var testAPIRouter = require("./routes/testAPI")
// The router to send default username and password
var testLoginRouter = require("./routes/testLogin")
// The login router for practicing and testing
var loginRouter = require("./routes/login")
// !!

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// allow cross region
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// !!
// Use the test API router
app.use("/testAPI",testAPIRouter);
// Use the test login router
app.use("/testLogin",testLoginRouter);
// Use the login router
app.use("/Login",loginRouter);
// !!

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

const io = require("socket.io")(server, {
  cors: {
    origin: "localhost:5000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text}) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})

module.exports = app;
