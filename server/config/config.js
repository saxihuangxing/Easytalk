const fs = require("fs");
const fileData = fs.readFileSync("./config/config.json", "utf8")
const jsonData = JSON.parse(fileData)

//jsonData["survival"] = "online"
//fs.writeFile("./serverStatus.json", JSON.stringify(jsonData))

const config  = {
    server:{
        port:8890, 
    },
  //  dbUrl : 'mongodb://roselyn:roselyn520@106.52.36.117:27017/admin',
  //  dbUrl : 'mongodb://106.52.36.117:27017/funtalk?replicaSet=rs0', 
    dbUrl : 'mongodb://10.7.7.5:27017,10.7.7.2:27017,10.7.7.3:27017/funtalk?replicaSet=dbrs', 
    log : {
        "filename": "/var/log/funtalk_backend.log",
        "level": "verbose"
    },
    ...jsonData
};


module.exports = config
