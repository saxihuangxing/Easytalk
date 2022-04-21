var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const dbCol = require('../../dbManage/dbOperate')('tutor');
const CONSTANT = require('../../constant');


router.post('/updateTutorInfo', async function(req, res, next) {
    //利用bodyParser 获取表单提交的数据
    const param = req.body;
    const query = { id:req.session.id };
    try{
        const result = await dbCol.updateOne(query,param); 
        res.send({ code:CONSTANT.RES_SUCCESS });   
    }catch(err){
        Logger.error(`updateTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});

router.post('/getTutorInfo', async function(req, res, next) {
    //利用bodyParser 获取表单提交的数据
    const projection = req.body.projection?{ ...req.body.projection, accountPassword:0}:{accountPassword:0};
    const query = { id:req.session.id }; 
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
    const query = { id:req.session.id }; 
    try{
        const result = await dbCol.updateOne(query,{scheduleMap}); 
        res.send({ code:CONSTANT.RES_SUCCESS });   
    }catch(err){
        Logger.error(`updateTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});

module.exports = router;
