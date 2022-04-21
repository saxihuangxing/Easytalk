const Logger = require("./Logger");

 async function getOnlyId(dbCol){
    for(let i = 0;i<100; i++){                              
      const id = Math.random().toString().substring(3,10);
      const exist = dbCol.exist({ id });
      if(!exist){
          return id;
      }
    }
    Logger.error("can't find a exlusive id over 100 times");
    throw("can't find suitable Id");
}



module.exports = {
    getOnlyId,
}