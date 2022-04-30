const fs = require("fs");
const fileData = fs.readFileSync("./config/config.json", "utf8")
const jsonData = JSON.parse(fileData)

//jsonData["survival"] = "online"
//fs.writeFile("./serverStatus.json", JSON.stringify(jsonData))

const config  = {
    server:{
        port:8890, 
    },
    dbUrl : 'mongodb://106.52.36.117:27017/funtalk',

   // dbUrl : 'mongodb://106.52.36.117:27021,106.52.36.117:27022/funtalk?replicaSet=dbrs', 
    log : {
        "filename": "/var/log/funtalk_backend.log",
        "level": "verbose"
    },
    oneClassTime: 25, //unit minute
    cancelLessonlimitTime : 60,   // unit minute
    ...jsonData
};


module.exports = config
