const createError = require('http-errors');
const express = require('express');
const session = require("express-session");
const path = require('path');
const cookieParser = require('cookie-parser');
const access = require('./routers/access/index');
const tutorRouter = require('./routers/tutor/index');
const studentRouter = require('./routers/student/index');
const adminRouter = require('./routers/admin/index');
const commonRouter = require('./routers/common/index');
const fileUpload = require('express-fileupload');

const startLessonMonitor = require('./service/lessonMonitor');

const app = express();

app.use(function (req, res, next) {
    req.url = req.url.replace("/api/","/");
    next();
});

app.use(fileUpload({
    createParentPath: true
}));

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

const interval = startLessonMonitor();

app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    const currPath = req.url;
    console.log("currPath = " + currPath);
    if (currPath == "/user/login"  || currPath == "/user/logout" 
        || currPath == "/user/enroll" || currPath == '/common/getSystemConfig') {
        next();
    } else {
        let role = "";
        if(currPath.startsWith('/admin')){
            role = 'admin';
        }else if(currPath.startsWith('/tutor')){
            role = 'tutor';
        }else if(currPath.startsWith('/student')){
            role = 'student';
        }
        if (req.session.userId && (req.session.role === role || currPath.startsWith('/common'))) {
            // app.locals["userInfo"] = req.session.userInfo.username;        
            next();
        } else {
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
app.use('/admin', adminRouter);
app.use('/common', commonRouter);


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
