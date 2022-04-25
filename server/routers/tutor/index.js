var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const dbCol = require('../../dbManage/dbOperate')('tutor');
const CONSTANT = require('../../constant');
const Constant = require('../../constant');


router.post('/updateTutorInfo', async function(req, res, next) {
    //利用bodyParser 获取表单提交的数据
    const param = req.body;
    const query = { id:req.session.userId };
    try{
        const result = await dbCol.updateOne(query,param); 
        if(result.n > 0){
            res.send({ code:CONSTANT.RES_SUCCESS }); 
            return; 
        } 
    }catch(err){
        Logger.error(`updateTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });
        return;  
    }
    res.send({ code:CONSTANT.RES_FAILED });      
});

router.post('/getTutorInfo', async function(req, res, next) {
    //利用bodyParser 获取表单提交的数据
    const projection = req.body.projection?req.body.projection:{accountPassword:0};
    const query = { id:req.session.userId }; 
    try{
        const data = await dbCol.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });   
    }catch(err){
        Logger.error(`getTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }
});

router.post('/setTutorSchedule', async function(req, res, next) {
    //利用bodyParser 获取表单提交的数据
    const scheduleMap = req.body.scheduleMap;
    const query = { id:req.session.userId }; 
    try{
        const tutor = await dbCol.findOnePromise(query); 
        const oldScheduleMap = tutor.scheduleMap;
        for (const [key, value] of oldScheduleMap) {
            if(value === Constant.SCHEDULE_STATUS.BOOKED
            && scheduleMap[key] !== Constant.SCHEDULE_STATUS.BOOKED){
            Logger.error(`setTutorSchedule error, can't change already booked lesson status`);
            res.send({ code:CONSTANT.RES_FAILED });  
            return;
          }
        }
        const result = await dbCol.updateOne(query,{scheduleMap}); 
        if(result.n > 0){
            res.send({ code:CONSTANT.RES_SUCCESS }); 
            return;   
        } 
    }catch(err){
        Logger.error(`updateTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
        return; 
    }
    res.send({ code:CONSTANT.RES_FAILED });    
});

module.exports = router;
