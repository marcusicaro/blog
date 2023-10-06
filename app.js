var createError = require('http-errors');
const debug = require('debug')('app');
var express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var cors = require('cors');
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
var whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

var app = express();

app.use(cors());

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
