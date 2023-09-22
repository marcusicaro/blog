var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var indexRouter = require('./routes/index');
const MongoDBKey = process.env.MONGODB_KEY;
const dev_db_url = `mongodb+srv://admin:${MongoDBKey}@cluster0.lnrds0m.mongodb.net/blog?retryWrites=true&w=majority`;
const mongoDB = dev_db_url;

mongoose.set('strictQuery', false);
main().catch((err) => debug(err));
async function main() {
  await mongoose.connect(mongoDB);
}

var app = express();

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('there was an error');
});

app.listen(3002, () => console.log('app listening on port 3002!'));

module.exports = app;
