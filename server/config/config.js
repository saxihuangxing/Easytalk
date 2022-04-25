const config  = {
    server:{
        port:8890, 
    },
    dbUrl : "mongodb://106.52.36.117:27017/",
    log : {
        "filename": "/var/log/funtalk_backend.log",
        "level": "verbose"
    },
    oneClassTime: 25, //unit minute
    cancelLessonlimitTime : 180,   // unit minute
};


module.exports = config
