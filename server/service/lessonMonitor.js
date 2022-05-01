const Logger = require('../utils/Logger');
const dbLesson = require('../dbManage/dbOperate')('lesson');
const Constant = require('../constant');
const Config = require('../config/config');
const { config } = require('winston');

const checkInterval = 60 * 1000;

async function LessonStatusMonitor(){
    const lessons = await dbLesson.findPromise({ $or: [{ status:Constant.LESSON_STATUS.WAITING },
         { status:Constant.LESSON_STATUS.TAKING }] });
    for(let i in lessons){
        const lesson = lessons[i];
        const curTime = Date.now()/1000/60;
        if(lesson.status == Constant.LESSON_STATUS.WAITING){
            const ds =  lesson.lessonTime - curTime;
            //console.log("ds = " + ds + " lesson.lessonTime = " + lesson.lessonTime + "curTime = " + curTime);
            if(ds >= 0 && ds <=  Config.oneClassTime){
                await dbLesson.updateOne({ lessonId:lesson.lessonId }, { status:Constant.LESSON_STATUS.TAKING });
                Logger.info(`lesson ${lesson.lessonId} enter runing status`);        
            }else if(ds <= 0){
                dbLesson.updateOne({ lessonId:lesson.lessonId }, { status:Constant.LESSON_STATUS.FINISHED }); 
                Logger.info(`lesson ${lesson.lessonId} enter finished status`);    
            }       
        }else if(lesson.status == Constant.LESSON_STATUS.TAKING){
            if(curTime > (lesson.lessonTime + Config.oneClassTime)){
                dbLesson.updateOne({ lessonId:lesson.lessonId }, { status:Constant.LESSON_STATUS.FINISHED }); 
                Logger.info(`lesson ${lesson.lessonId} enter finished status`);               
            }
        }
    }     
}

function startLessonMonitor(){
   LessonStatusMonitor();
   const interval =  setInterval( LessonStatusMonitor, checkInterval );
   return interval;    
}


module.exports = startLessonMonitor;