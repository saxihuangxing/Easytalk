var express = require('express');
var router = express.Router();
var config =require("../../config/config");
const Logger = require('../../utils/Logger');
const CONSTANT = require('../../constant');
const dbTutor = require('../../dbManage/dbOperate')('tutor');
const dbStudent = require('../../dbManage/dbOperate')('student');
const dbWallet = require('../../dbManage/dbOperate')('wallet');
const dbAdmin = require('../../dbManage/dbOperate')('admin');
const { getOnlyId } = require('../../utils/common'); 
const mongoose = require('../../dbManage/dbHandle');

const initAdminDb = () => {
    dbAdmin.updateOneOrAdd({ accountName:'huangxing' },{ "id":"00001", accountName:'huangxing', accountPassword:'c07681b88d6b2c4463e7a9a677efd8d4' });
    Logger.info('add admin account');
}
initAdminDb(); 
router.post('/login', async function(req, res, next) {
    //利用bodyParser 获取表单提交的数据
    const param = req.body;
    const dbCol = require('../../dbManage/dbOperate')(param.role);
    try{
        const data = await dbCol.findOnePromise({ accountPassword:param.accountPassword,accountName:param.accountName }); 
        if(data){
            req.session.userId = data.id;
            req.session.role = param.role;
            res.send(`{"code":${CONSTANT.RES_SUCCESS}}`);
            Logger.info(param.accountName + " login sucess");
            return;
        }
    }catch(err){
        Logger.error(`login exception ${err}`);
    }
    res.send(`{"code":${CONSTANT.RES_FAILED}}`);
    Logger.error(param.accountName + " login failed");
});


router.post('/enroll', async function(req, res, next) {
    //利用bodyParser 获取表单提交的数据
    const param = req.body;
    const {APPLY_STATUS,ENROLL_FAIL_REASON} = CONSTANT;
    let id = "00001";
    try{
        if(param.role === 'tutor'){
            const isExist = await dbTutor.exist({ accountName:param.accountName });
            if(isExist){
                res.send({"code":CONSTANT.RES_FAILED,reason:ENROLL_FAIL_REASON.EXIST_USERNAME});
                return;
            }
            id = await getOnlyId(dbTutor);
            const data = { id,accountName:param.accountName,accountPassword: param.accountPassword,
                applyStatus:APPLY_STATUS.CHECKING }; 
            await dbTutor.add(data);      
        }else if(param.role === 'student'){
            const isExist = await dbStudent.exist({ accountName:param.accountName });
            if(isExist){
                res.send({"code":CONSTANT.RES_FAILED,reason:ENROLL_FAIL_REASON.EXIST_USERNAME});
                return;
            }
            id = await getOnlyId(dbStudent);
            const walletId = await getOnlyId(dbWallet);
            const walletData = {id: walletId, userId : id, balance:config.walletInitCoin};
            const data = { id, accountName:param.accountName, accountPassword: param.accountPassword,
                walletId }; 
           // const session = await mongoose.startSession()
           // session.startTransaction();
            try{    
                  await dbWallet.add(walletData);
                  await dbStudent.add(data);
             //   await dbWallet.add([walletData],session);
             //   await dbStudent.add([data],session);
              //  await session.commitTransaction();
            }catch(err){
                Logger.error(`enroll student commitTransation error: ${err}`);
               // await session.abortTransaction();
                res.send({ code:CONSTANT.RES_FAILED, reson:CONSTANT.Book_FAIL_REASON.UNKNOW  }); 
            //    session.endSession();
                return;
            } 
          //  session.endSession();     
        }else{
            res.send({ "code":CONSTANT.RES_FAILED, reason:ENROLL_FAIL_REASON.WRONG_ROLE });
            return;
        }
    }catch(err){
        Logger.error(`enroll exception ${err}`);
        res.send({ "code":CONSTANT.RES_FAILED, reason:ENROLL_FAIL_REASON.UNKNOWN, errDetail:err });
        return;
    }
    req.session.userId = id;
    req.session.role = param.role;
    res.send({"code":CONSTANT.RES_SUCCESS});
});

router.get("/logout",function (req,res) {
    req.session.destroy(function (err) {
        if(err){

        }else{
            res.redirect("/login");
        }
    });
});


module.exports = router;
