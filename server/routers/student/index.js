var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const dbStudent = require('../../dbManage/dbOperate')('student');
const dbLesson = require('../../dbManage/dbOperate')('lesson');
const Constant = require('../../constant');
const Config = require('../../config/config');
const CommonUtil = require('../../utils/common');
const { constants } = require('crypto');

/* router.post('/getAllStudentInfo', async function(req, res, next) {
    const projection = req.body.projection?{ ...req.body.projection, accountPassword:0}:{accountPassword:0};
    const query = {};
    try{
        const data = await dbCol.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });   
    }catch(err){
        Logger.error(`student getAllTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
}); */

router.post('/bookLesson', async function(req, res, next) {
    try{
        const { lesson } = req.body;
        if(!lesson){
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.DATA_INCOMPELETE  });
            return;      
        }
        let check =  await CommonUtil.checkTutorStatus(lesson.tutorId,lesson.lessonTime,Constant.SCHEDULE_STATUS.Available);
        if(!check){
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.TUTOR_UNAVAILABLE  });
            return;    
        }
        const lessonId = await CommonUtil.getOnlyId(dbLesson);
        const status = Constant.LESSON_STATUS.WAITING;
        const data = {lessonId,status,...lesson};
        check = await CommonUtil.setTutorSchedule(lesson.tutorId,lesson.lessonTime,Constant.SCHEDULE_STATUS.BOOKED);
        if(!check){
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.UNKNOW  });
            return;    
        }
        await dbLesson.add(data);
        res.send({ code:Constant.RES_SUCCESS });   
    }catch(err){
        Logger.error(`student bookLesson err: ${err}`);
        res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.UNKNOW  }); 
        return; 
    }
});


router.post('/cancelLesson', async function(req, res, next) {
    try{
        const { lessonId } = req.body;
        if(!lessonId){
            Logger.error(`cancelLesson lessonId error,lessonId = ${lessonId}`);
            res.send({ code:Constant.RES_FAILED, reson:Constant.CANCEL_LESSON_FAIL_REASON.LessonInfoError  });
            return;      
        }
        const lesson = await dbLesson.findOnePromise({ lessonId });
        if(!lesson || lesson.status !== Constant.LESSON_STATUS.WAITING){
            Logger.error(`cancelLesson Lesson status error,lesson = ${lesson}`, "status:", lesson?lesson.status:"null" );
            res.send({ code:Constant.RES_FAILED, reson:Constant.CANCEL_LESSON_FAIL_REASON.LessonInfoError  });
            return;
        }
        let check =  await CommonUtil.checkTutorStatus(lesson.tutorId, lesson.lessonTime, Constant.SCHEDULE_STATUS.BOOKED);
        if(!check){
            Logger.error(`cancelLesson tutor schedule status error`);
            res.send({ code:Constant.RES_FAILED, reson:Constant.CANCEL_LESSON_FAIL_REASON.LessonInfoError  });
            return;    
        }

        const lessonDistance = lesson.lessonTime - (new Date().getTime())/1000/60;
        if( lessonDistance <  Config.cancelLessonlimitTime){
            Logger.error(`cancelLesson: The lesson is too Close ,only ${lessonDistance} minutes left`);
            res.send({ code:Constant.RES_FAILED, reson:Constant.CANCEL_LESSON_FAIL_REASON.TimeTooClose  });
            return; 
        }
        const result = await dbLesson.updateOne({ lessonId }, { status:Constant.LESSON_STATUS.CANCELED });
        if(result.n <= 0){
            Logger.error(`cancelLesson: update lesson info err! , no info update`);
            res.send({ code:Constant.RES_FAILED, reson:Constant.CANCEL_LESSON_FAIL_REASON.UNKNOW  });
            return;  
        }
        check = await CommonUtil.setTutorSchedule(lesson.tutorId,lesson.lessonTime,Constant.SCHEDULE_STATUS.Available);
        if(!check){
            Logger.error(`cancelLesson: setTutor Schedule err!`);
            res.send({ code:Constant.RES_FAILED, reson:Constant.CANCEL_LESSON_FAIL_REASON.UNKNOW  });
            return;    
        }
        res.send({ code:Constant.RES_SUCCESS });   
    }catch(err){
        Logger.error(`student cancelLesson err: ${err}`);
        res.send({ code:Constant.RES_FAILED, reson:Constant.CANCEL_LESSON_FAIL_REASON.UNKNOW  }); 
        return; 
    }
});


router.post('/studentGetSelfInfo', async function(req, res, next) {
    try{
        const projection = {accountPassword:0};
        const query = { id:req.session.userId }
        const data = await dbStudent.findOneLimiteFiledsPromise(query,projection);
        res.send({ code:Constant.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`studentGetSelfInfo err: ${err}`);
        res.send({ code:Constant.RES_FAILED });
    }    
});

router.post('/getMyLesson', async function(req, res, next) {
    const query = req.body.query;
    try{
        const newQuery = { stuId:req.session.userId, ...query };
        const data = await dbLesson.findPromise(newQuery);
        res.send({ code:Constant.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`getBookedLesson err: ${err}`);
        res.send({ code:Constant.RES_FAILED });
    }
});



module.exports = router;