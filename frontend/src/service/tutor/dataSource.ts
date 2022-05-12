import Axios from 'axios';
import md5 from "md5";
import Qs from 'qs';
import CONSTANT from '@/constant';
import Constant from '@/constant';

export interface TutorStructure{
  accountName:string,
  accountPassword:string,
}
export interface TutorEnrollResult{
  code:number,
  reason:number,
  errDetails:string,
}

export async function tutorEnroll( values:TutorStructure ) {
  const accountPassword = md5( values.accountPassword);
  const accountName = values.accountName;
  const params = {
    accountName,
    accountPassword,
    role:Constant.ROLE.TUTOR,
  };
  try{
   const response = await Axios.post('/api/user/enroll', Qs.stringify(params)); 
   const { data } = response;
   return data; 
  }catch(err){
    return {"code":CONSTANT.RES_FAILED,reason:CONSTANT.ENROLL_FAIL_REASON.UNKNOWN,errDetail:err}
  }
}

export async function tutorLogin( values:TutorStructure ) {
  const accountPassword = md5( values.accountPassword);
  const accountName = values.accountName;
  const params = {
    accountName,
    accountPassword,
    role:Constant.ROLE.TUTOR,
  };
  try{
   const response = await Axios.post('/api/user/login', Qs.stringify(params)); 
   const { data } = response;
   return data; 
  }catch(err){
    return {"code":CONSTANT.RES_FAILED}
  }
}

export async function getTutorSchedule() {
  const params = {
    projection: {scheduleMap:1}
  };
  const res = await Axios.post('/api/tutor/getTutorInfo',params);
  if(res.status == 200 && res.data.code == Constant.RES_SUCCESS){
      const targetData = res.data.data;
      if(Array.isArray(targetData) && targetData.length > 0){
        return targetData[0].scheduleMap;
      }
  }
  return null;
}

export async function setTutorSchedule(scheduleMap) {
  const res = await Axios.post('/api/tutor/setTutorSchedule', {scheduleMap});
  if(res.status == 200){
    return res.data;
  }
  return null;
}

export async function getTutorInfo(projection) {
  const params = {
    projection
  };
  const res = await Axios.post('/api/tutor/getTutorInfo',params);
  if(res.status == 200){
    return res.data;
  }
  return null;
}

export async function setTutorInfo(params) {
  const res = await Axios.post('/api/tutor/updateTutorInfo', params);
  if(res.status == 200){
    return res.data;
  }
  return null;
}

export async function deletePhoto(fileName:string) { 
  const res = await Axios.post('/api/tutor/delete-photo', { fileName });
  if(res.status == 200){
    return res.data;
  }
  return null;
}

export async function deleteVideo(fileName:string) { 
  const res = await Axios.post('/api/tutor/delete-video', { fileName });
  if(res.status == 200){
    return res.data;
  }
  return null;
}

export async function getBookedLesson() {
  try{
    const response = await Axios.post('/api/tutor/getMyLesson',
    { query:{ $or: [{ status:Constant.LESSON_STATUS.WAITING },
      { status:Constant.LESSON_STATUS.TAKING }] }}); 
    const { data } = response;
    return data; 
   }catch(err){
     return { "code":Constant.RES_FAILED }
   }
}
export async function getHistoryLesson() {
  try{
    const response = await Axios.post('/api/tutor/getMyLesson',
    { query:{ status:Constant.LESSON_STATUS.FINISHED  }}); 
    const { data } = response;
    return data; 
   }catch(err){
     return { "code":Constant.RES_FAILED }
   }
}

export async function getCanceledLesson() {
  try{
    const response = await Axios.post('/api/tutor/getMyLesson',
    { query:{ $or: [{ status:Constant.LESSON_STATUS.CANCELED },
      { status:Constant.LESSON_STATUS.REFUND }, { status:Constant.LESSON_STATUS.DISPUTE } ] } });
    const { data } = response;
    return data; 
   }catch(err){
     return { "code":Constant.RES_FAILED }
   }
}