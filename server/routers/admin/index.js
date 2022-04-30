var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const tutorDb = require('../../dbManage/dbOperate')('tutor');
const walletDb = require('../../dbManage/dbOperate')('wallet');
const studentDb = require('../../dbManage/dbOperate')('stusdent');
const CONSTANT = require('../../constant');
const dbTopupApply = require('../../dbManage/dbOperate')('topupApply');

router.post('/setTutorApplyResult', async function(req, res, next) {
    const tutorId = req.body.tutorId;
/* try{
        const data = await studentDb.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`student getAllTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    } */
});

router.post('/deleteStudent', async function(req, res, next) {
    const id = req.body.studentId;
    try{
        await studentDb.remove({ id });
        await walletDb.remove({ userId: id });
        res.send({ code:CONSTANT.RES_SUCCESS });  
    }catch(err){
        Logger.error(`deleteStudent err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }
/* try{
        const data = await studentDb.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`student getAllTutorInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    } */
});

const topupWallet = async (walletId,amount) => {
    const wallet = await walletDb.findOnePromise({ id:walletId });
    if(!wallet){
        res.send({ code:CONSTANT.RES_FAILED, reason: "can't find wallet" });
        return; 
    }
    wallet.balance = wallet.balance + amount;
    const transation = { action:true, amount:amount, time: Date.now(),
        reason: CONSTANT.walletTransReason.topup, balance:wallet.balance };
    wallet.transations.unshift(transation);
    await wallet.save();
    return wallet.balance;
}

router.post('/TopUpWallet', async function(req, res, next) {
    const walletId = req.body.walletId;
    const amount = req.body.amount;
    if(!walletId || !amount){
        res.send({ code:CONSTANT.RES_FAILED, reason: "walletId or amount null" });
        return; 
    }
    try{
        const balance = await topupWallet(walletId,amount)
        res.send({ code:CONSTANT.RES_SUCCESS, balance: balance});
    }catch(err){
        res.send({ code:CONSTANT.RES_FAILED, reason: `run err: ${err}`  });
    }
});


router.post('/getWalletInfo', async function(req, res, next) {
    const projection = req.body.projection;
    const query = req.body.query?req.body.query:{};
    try{
        const data = await walletDb.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`getWalletInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});


router.post('/getTopupApplyInfo', async function(req, res, next) {
    const projection = req.body.projection;
    const query = req.body.query?req.body.query:{};
    try{
        const data = await dbTopupApply.findLimiteFiledsPromise(query,projection);
        res.send({ code:CONSTANT.RES_SUCCESS, data });
    }catch(err){
        Logger.error(`getWalletInfo err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});

router.post('/dealTopupApply', async function(req, res, next) {
    const approve = req.body.approve;
    const query = { id:req.body.id }
    try{
        const apply = await dbTopupApply.findOnePromise(query);
        apply.status = approve? "approved":"reject";
        if(approve){
            await topupWallet(apply.walletId,apply.amount);     
        }
        await apply.save();
        res.send({ code:CONSTANT.RES_SUCCESS });
    }catch(err){
        Logger.error(`dealTopupApply err: ${err}`);
        res.send({ code:CONSTANT.RES_FAILED });  
    }    
});


module.exports = router;