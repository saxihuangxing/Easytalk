var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const tutorDb = require('../../dbManage/dbOperate')('tutor');
const studentDb = require('../../dbManage/dbOperate')('stusdent');
const CONSTANT = require('../../constant');

router.post('/setTutorApplyResult', async function(req, res, next) {
    const projection = req.body.projection?{ ...req.body.projection, accountPassword:0}:{accountPassword:0};
    const query = req.body.query?req.body.query:{};
    try{
        const data = await studentDb.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`student getAllTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});

module.exports = router;