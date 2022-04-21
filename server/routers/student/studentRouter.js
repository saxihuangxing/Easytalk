var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const dbCol = require('../../dbManage/dbOperate')('student');
const CONSTANT = require('../../constant');

router.post('/getAllStudentInfo', async function(req, res, next) {
    const projection = req.body.projection?{ ...req.body.projection, accountPassword:0}:{accountPassword:0};
    const query = {};
    try{
        const data = await dbCol.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });   
    }catch(err){
        Logger.error(`student getAllTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});

module.exports = router;