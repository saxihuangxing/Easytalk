var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const dbStudent = require('../../dbManage/dbOperate')('student');
const dbLesson = require('../../dbManage/dbOperate')('lesson');
const Constant = require('../../constant');
const CommonUtil = require('../../utils/common');

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
        let check =  await CommonUtil.checkTutorAvailable(lesson.tutorId,lesson.lessonTime);
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

router.post('/getBookedLesson', async function(req, res, next) {
    try{
        const query = { stuId:req.session.userId }
        const data = await dbLesson.findPromise(query);
        res.send({ code:Constant.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`studentGetSelfInfo err: ${err}`);
        res.send({ code:Constant.RES_FAILED });
    }
});



module.exports = router;