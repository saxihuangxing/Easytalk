const Logger = require("./Logger");
const dbTutor = require('../dbManage/dbOperate')('tutor');
const Constant = require('../constant');

 async function getOnlyId(dbCol){
    for(let i = 0;i<100; i++){                              
      const id = Math.random().toString().substring(3,10);
      console.log("id = " + id);
      const exist = await dbCol.exist({ id });
      if(!exist){
          return id;
      }
    }
    Logger.error("can't find a exlusive id over 100 times");
    throw("can't find suitable Id");
}

async function checkTutorAvailable(tutorId,time){
    try{
        let data =  await dbTutor.findOneLimiteFiledsPromise({id:tutorId},{scheduleMap:1});
        if(data && data.scheduleMap){
            if(data.scheduleMap.get(time) == Constant.SCHEDULE_STATUS.Available){
                return true;
            }
        }
    }catch(err){
        Logger.error("checkTutorAvailable error " + err);
    }
    return false; 
}

async function setTutorSchedule(tutorId,time,status){
    try{
        let data =  await dbTutor.findOneLimiteFiledsPromise({id:tutorId},{scheduleMap:1});
        if(data && data.scheduleMap){
            data.scheduleMap.set(time,status);
        }else{
            return false;
        }
        await dbTutor.updateOne({id:tutorId},{scheduleMap:data.scheduleMap});
        return true;
    }catch(err){
        Logger.error("setTutorSchedule error " + err + " tutorId: " + tutorId);
        return false;
    }
}


module.exports = {
    getOnlyId,
    checkTutorAvailable,
    setTutorSchedule,
}