var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const dbStudent = require('../../dbManage/dbOperate')('student');
const dbLesson = require('../../dbManage/dbOperate')('lesson');
const dbTutor = require('../../dbManage/dbOperate')('tutor');
const dbWallet = require('../../dbManage/dbOperate')('wallet');
const dbTopupApply = require('../../dbManage/dbOperate')('topupApply');
const Constant = require('../../constant');
const Config = require('../../config/config');
const CommonUtil = require('../../utils/common');
const emailManage = require('../../service/emailMange');
const { constants } = require('crypto');
const mongoose = require('../../dbManage/dbHandle');

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

const  getRefundAmount =  (lessonDistance) => {
    const { cancelLessonRules } = Config;
    for(let i in cancelLessonRules){
        const rule = cancelLessonRules[i];
        if(lessonDistance >= rule.time){
            return rule.refundRate;
        }
    }
    return 0;
}

router.post('/bookLesson', async function(req, res, next) {
    try{
        const { lesson } = req.body;
        if(!lesson){
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.DATA_INCOMPELETE  });
            return;      
        }
        let check =  await CommonUtil.checkTutorStatus(lesson.tutorId, lesson.lessonTime, Constant.SCHEDULE_STATUS.Available);
        if(!check){
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.TUTOR_UNAVAILABLE  });
            return;    
        }
        const student = await dbStudent.findOneLimiteFiledsPromise({ id:lesson.stuId },{ walletId:1 });
        const wallet = await dbWallet.findOnePromise({ id:student.walletId });
        if(wallet.balance < Config.lessonPrice){
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.INSUFFIENT_COIN  });
            return;  
        }
        const lessonId = await CommonUtil.getOnlyId(dbLesson);
        const status = Constant.LESSON_STATUS.WAITING;
        const cost = Config.lessonPrice;
        const lessonData = {lessonId,status,cost,...lesson};
        const tutor =  await dbTutor.findOneLimiteFiledsPromise({ id:lesson.tutorId });
        tutor.scheduleMap.set(lesson.lessonTime.toString(), Constant.SCHEDULE_STATUS.BOOKED);
        wallet.balance = wallet.balance - Config.lessonPrice;
        const transation = {
            action: false,
            balance:  wallet.balance,
            amount: Config.lessonPrice,
            time: Date.now(),
            reason: Constant.walletTransReason.bookLesson,
            refLessonId: lessonId,
        }
        wallet.transations.unshift(transation);
    //    const session = await mongoose.connection.startSession(); 
        try{
       //     tutor.session(session);
            
       //     wallet.session(session);
            await dbLesson.add(lessonData);
            await wallet.save();
            await tutor.save();
       //     await dbLesson.add(lessonData,session);
       //     await session.commitTransaction();
        }catch(error) {
            Logger.error(`student bookLesson commitTransation error: ${error}`);
        //    await session.abortTransaction();
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.UNKNOW  }); 
            return;
        }
        /* check = await CommonUtil.setTutorSchedule(lesson.tutorId,lesson.lessonTime,Constant.SCHEDULE_STATUS.BOOKED);
        if(!check){
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.UNKNOW  });
            return;    
        }
        await dbLesson.add(data); */
        emailManage.bookLessonNotify(tutor.accountName, tutor.name, lessonData.stuName,lessonData.lessonTime);   
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
        const refundRate = getRefundAmount(lessonDistance);
        const refundAmount = lesson.cost * refundRate;
        if(refundAmount <= 0){
            Logger.error(`can't refund , refundAmount ${refundAmount}`);
            res.send({ code:Constant.RES_FAILED, reson:Constant.CANCEL_LESSON_FAIL_REASON.TimeTooClose  });
            return; 
        }
        const tutor =  await dbTutor.findOneLimiteFiledsPromise({ id:lesson.tutorId });
        tutor.scheduleMap.set(lesson.lessonTime.toString(),Constant.SCHEDULE_STATUS.Available);
        const student = await dbStudent.findOneLimiteFiledsPromise({ id:lesson.stuId },{ walletId:1 });
        const wallet = await dbWallet.findOnePromise({ id:student.walletId });
        wallet.balance += refundAmount;
        const transation = {
            action: true,
            balance:  wallet.balance,
            amount: refundAmount,
            refundRate: refundRate,
            time: Date.now(),
            reason: Constant.walletTransReason.cancelLesson,
            refLessonId: lesson.lessonId,
        }
        wallet.transations.unshift(transation);
        lesson.status = Constant.LESSON_STATUS.CANCELED;
       // const session = await mongoose.connection.startSession();
        try{    
         //   tutor.session(session);
         //   wallet.session(session);
         //   lesson.session(session);
            await tutor.save();
            await wallet.save();
            await lesson.save();
           // await session.commitTransaction();
        }catch(err){
            Logger.error(`student cancel lesson commitTransation error: ${err}`);
          //  await session.abortTransaction();
            res.send({ code:Constant.RES_FAILED, reson:Constant.Book_FAIL_REASON.UNKNOW  }); 
            return;
        }
        /* const result = await dbLesson.updateOne({ lessonId }, { status:Constant.LESSON_STATUS.CANCELED });
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
        } */
        emailManage.cancelLessonNotify(tutor.accountName,tutor.name,lesson.stuName,lesson.lessonTime);
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

router.post('/topupApply', async function(req, res, next) {
    try{
        const student = await dbStudent.findOnePromise({ id:req.session.userId });
        const id = await CommonUtil.getOnlyId(dbTopupApply);
        const data = { id, amount:req.body.amount, walletId:student.walletId, status:'waiting', 
              stuId: student.id, stuName: student.name, time:Date.now()};
        await dbTopupApply.add(data);
        res.send({ code:Constant.RES_SUCCESS });
    }catch(err){
        Logger.error(`topupApply err: ${err}`);
        res.send({ code:Constant.RES_FAILED });
    }
});

router.post('/getMyWallet', async function(req, res, next) {
    try{
        const query = { userId:req.session.userId }
        const data = await dbWallet.findOneLimiteFiledsPromise(query);
        res.send({ code:Constant.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`getMyWallet err: ${err}`);
        res.send({ code:Constant.RES_FAILED });
    }    
});


module.exports = router;