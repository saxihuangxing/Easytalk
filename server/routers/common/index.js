var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const tutorDb = require('../../dbManage/dbOperate')('tutor');
const studentDb = require('../../dbManage/dbOperate')('student');
const lessonDb = require('../../dbManage/dbOperate')('lesson');
const CONSTANT = require('../../constant');
const fs = require('fs');

router.post('/getAllStudentInfo', async function(req, res, next) {
    const projection = req.body.projection?req.body.projection:{accountPassword:0};
    const query = req.body.query?req.body.query:{};
    try{
        const data = await studentDb.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`getAllStudentInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});

router.post('/getAllTutorInfo', async function(req, res, next) {
    const projection = req.body.projection?req.body.projection:{accountPassword:0};
    const query = req.body.query?req.body.query:{};
    try{
        const data = await tutorDb.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });   
    }catch(err){
        Logger.error(`getAllTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }
});


router.post('/getOneTutorInfo', async function(req, res, next) {
    const projection = req.body.projection?req.body.projection:{accountPassword:0};
    const query = req.body.query?req.body.query:{};
    try{
        const data = await tutorDb.findOneLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });   
    }catch(err){
        Logger.error(`getOneTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }
});


router.post('/getOneStudentInfo', async function(req, res, next) {
    const projection = req.body.projection?req.body.projection:{accountPassword:0};
    const query = req.body.query?req.body.query:{};
    try{
        const data = await studentDb.findOneLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`getOneStudentInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});


router.post('/getSystemConfig', async function(req, res, next) {
    try{
        const data = fs.readFileSync(process.cwd() + '/config/config.json', 'utf8')
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`getSystemConfig err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});

router.post('/modifyPassword', async function(req, res, next) {
    const params = req.body.params;
    const db = require('../../dbManage/dbOperate')(params.role);
    try{
        const query = { accountName:params.accountName, accountPassword:params.oldPsw };
        const data = await db.findOneLimiteFiledsPromise(query);
        if(data){
            data.accountPassword = params.newPsw;
            await data.save();
            res.send({ code:CONSTANT.RES_SUCCESS });
            return;
        }     
    }catch(err){
        Logger.error(`modifyPassword err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED }); 
        return; 
    }
    res.send({ code:CONSTANT.RES_FAILED }); 
});


router.post('/getLessonById', async function(req, res, next) {
    const lessonId = req.body.lessonId;
    try{
        const data = await lessonDb.findOneLimiteFiledsPromise({ lessonId });
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`getWalletInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});


module.exports = router;