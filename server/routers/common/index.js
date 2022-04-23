var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const tutorDb = require('../../dbManage/dbOperate')('tutor');
const studentDb = require('../../dbManage/dbOperate')('stusdent');
const CONSTANT = require('../../constant');

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

module.exports = router;