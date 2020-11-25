var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const db = require("./models");


db.sequelize.sync().then(() => {
  console.log("sync db.");
});
// update rectangle
exports.UpdateRectangles = function(id, width, height, color,callback) {
  var sql = "UPDATE rectangles SET "+
  "width="+width+","+
  "height="+height+","+
  "color=\""+color+"\" "+
  "WHERE (ID ="+ id+")";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err);callback(true);return;}
    connection.query(sql, function(err, results) {
      connection.release();
      if(err) { console.log(err);callback(true);return; }
      callback(false,results);
    });
  });
};

// // delete rectangle
// exports.deleteRectangles = function(id,callback) {
//   var sql = "DELETE FROM rectangles WHERE id="+id;
//   // get a connection from the pool
//   pool.getConnection(function(err, connection) {
//     if(err) { console.log(err);callback(true);return;}
//     connection.query(sql, function(err, results) {
//       connection.release();
//       if(err) { console.log(err);callback(true);return; }
//       callback(false,results);
//     });
//   });
// };



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