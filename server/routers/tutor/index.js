var express = require('express');
var router = express.Router();
const Logger = require('../../utils/Logger');
const dbCol = require('../../dbManage/dbOperate')('tutor');
const CONSTANT = require('../../constant');
const Constant = require('../../constant');
const os = require('os');
const fs = require('fs')

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
        if(oldScheduleMap){
            for (const [key, value] of oldScheduleMap) {
                if(value === Constant.SCHEDULE_STATUS.BOOKED
                && scheduleMap[key] !== Constant.SCHEDULE_STATUS.BOOKED){
                Logger.error(`setTutorSchedule error, can't change already booked lesson status`);
                res.send({ code:CONSTANT.RES_FAILED });  
                return;
            }
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


router.post('/upload-photo', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let photo = req.files.file;
            let path = process.cwd() + '/public/files/' + photo.name;
            const sysType = os.type();
            if(sysType.indexOf('Window') >= 0){
                path = process.cwd() + '\\public\\files\\' + photo.name;
            }
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            photo.mv(path ,async ()=>{

                try{
                    const query = { id:req.session.userId };
                    const url =  '/files/' +　photo.name;
                    const tutor = await dbCol.findOnePromise(query);
                    if(tutor.photos.indexOf(url) < 0){ 
                        tutor.photos.push(url);
                    }
                    tutor.save();    
                    res.send({
                        status: true,
                        message: 'File is uploaded' ,
                        data: {
                            name: photo.name,
                            mimetype: photo.mimetype,
                            size: photo.size,
                            url,
                        }
                    });  
                    return; 
                }catch(err){
                    Logger.error(`upload-photo updateTutorInfo err: ${err}`);
                    res.status(500).send(err);
                    return;  
                }               
           });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


router.post('/delete-photo', async (req, res) => {
    const fileName = req.body.fileName;
    if(!fileName) {
        res.send({
            code:CONSTANT.RES_FAILED,
            reason: 'fileName is null'
        });
        return;
    } else {
        let path = process.cwd() + '/public/files/' + fileName;
        const sysType = os.type();
        if(sysType.indexOf('Window') >= 0){
            path = process.cwd() + '\\public\\files\\' + fileName;
        }
        try{
            const query = { id:req.session.userId };
            const url =  '/files/' +　fileName;
            const tutor = await dbCol.findOnePromise(query); 
            const index = tutor.photos.indexOf(url);
            if (index > -1) {
                tutor.photos.splice(index, 1); // 2nd parameter means remove one item only
            }
            tutor.save();
            fs.unlinkSync(path);    
            res.send({ code:CONSTANT.RES_SUCCESS });  
            return; 
        }catch(err){
            Logger.error(`delete-photo  err: ${err}`);
            res.send({ code:CONSTANT.RES_FAILED }); 
            return;  
        }               
    }
});

router.post('/upload-video', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let video = req.files.file;
            let path = process.cwd() + '/public/files/' + video.name;
            const sysType = os.type();
            if(sysType.indexOf('Window') >= 0){
                path = process.cwd() + '\\public\\files\\' + video.name;
            }
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            video.mv(path ,async ()=>{
                try{
                    const query = { id:req.session.userId };
                    const url =  '/files/' + video.name;
                    const tutor = await dbCol.findOnePromise(query);
                    tutor.video = url;
                    tutor.save();    
                    res.send({
                        status: true,
                        message: 'File is uploaded' ,
                        data: {
                            name: video.name,
                            mimetype: video.mimetype,
                            size: video.size,
                            url,
                        }
                    });  
                    return; 
                }catch(err){
                    Logger.error(`upload-video  err: ${err}`);
                    res.status(500).send(err);
                    return;  
                }               
           });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


router.post('/delete-video', async (req, res) => {
    const fileName = req.body.fileName;
    if(!fileName) {
        res.send({
            code:CONSTANT.RES_FAILED,
            reason: 'fileName is null'
        });
        return;
    } else {
        let path = process.cwd() + '/public/files/' + fileName;
        const sysType = os.type();
        if(sysType.indexOf('Window') >= 0){
            path = process.cwd() + '\\public\\files\\' + fileName;
        }
        try{
            const query = { id:req.session.userId };
            const url =  '/files/' +　fileName;
            const tutor = await dbCol.findOnePromise(query); 
            tutor.video = "";
            tutor.save();
            fs.unlinkSync(path);    
            res.send({ code:CONSTANT.RES_SUCCESS });  
            return; 
        }catch(err){
            Logger.error(`delete-video  err: ${err}`);
            res.send({ code:CONSTANT.RES_FAILED }); 
            return;  
        }               
    }
});

module.exports = router;
