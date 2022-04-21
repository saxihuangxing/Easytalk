var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
const access = require('./routers/access/index');
const tutorRouter = require('./routers/tutor/index');
const studentRouter = require('./routers/student/studentRouter');
var app = express();

app.use(function (req, res, next) {
    req.url = req.url.replace("/api/","/");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 },
    rolling: true
}));



app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    const currPath = req.url;
    if (currPath == "/user/login"  || currPath == "/user/logout" || currPath == "/user/enroll") {
        next();
    } else {
        if (req.session.id) {
            // app.locals["userInfo"] = req.session.userInfo.username;
            //如果已经登录，继续执行
            next();
        } else {
            //如果未登录，重定向回去
            let role = 'student';
            if(currPath.indexOf('admin') > 0){
                role = 'admin';
            }else if(currPath.indexOf('tutor') > 0){
                role = 'tutor'
            }
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(`{"code":"403","reson":"Not authorized.","role":"${role}"}`);
        }
    }
});

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/user', access);
app.use('/tutor', tutorRouter);
app.use('/student', studentRouter);
//app.use('/admin', countInfoRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
/*app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});*/


module.exports = app;
