import Axios from 'axios';
import md5 from "md5";
import Qs from 'qs';
import Constant from '@/constant';

export interface StudentStructure{
  accountName:string,
  accountPassword:string,
  name: string,
}

export interface LessonStructure{
  stuId: string,
  stuName: string,
  tutorId: string,
  tutorName: string,
  bookTime: Number,
  lessonTime: string,
  textBook: string,
  lessonType: string,  // 'book' | 'sudden'
}
export interface StudentEnrollResult{
  code:number,
  reason:number,
  errDetails:string,
}

export async function enroll( values:StudentStructure ) {
  const accountPassword = md5( values.accountPassword);
  const accountName = values.accountName;
  const params = {
    accountName,
    accountPassword,
    role:Constant.ROLE.STUDENT,
  };
  try{
   const response = await Axios.post('/api/user/enroll', Qs.stringify(params)); 
   const { data } = response;
   return data; 
  }catch(err){
    return {"code":Constant.RES_FAILED,reason:Constant.ENROLL_FAIL_REASON.UNKNOWN,errDetail:err}
  }
}

export async function login( values:StudentStructure ) {
  const accountPassword = md5( values.accountPassword);
  const accountName = values.accountName;
  const params = {
    accountName,
    accountPassword,
    role:Constant.ROLE.STUDENT,
  };
  try{
   const response = await Axios.post('/api/user/login', Qs.stringify(params)); 
   const { data } = response;
   return data; 
  }catch(err){
    return {"code":Constant.RES_FAILED}
  }
}

export async function getSelfInfo(){
  try{
    const response = await Axios.post('/api/student/studentGetSelfInfo', {}); 
    const { data } = response;
    if(data.code === Constant.RES_SUCCESS){
      return data.data;
    }else{
      console.error(`getSelfInfo failed , response = ${JSON.stringify(data)}`)
      return null;
    }
   }catch(err){
     return null;
   }
}

export async function bookLesson( lesson:LessonStructure ) {
  try{
    const response = await Axios.post('/api/student/bookLesson', {lesson}); 
    const { data } = response;
    return data; 
   }catch(err){
     return { "code":Constant.RES_FAILED }
   }
}

export async function cancelLesson(lessonId) {
  try{
    const response = await Axios.post('/api/student/cancelLesson', 
      { lessonId }); 
    const { data } = response;
    return data; 
   }catch(err){
     return { "code":Constant.RES_FAILED }
   }
}

export async function getBookedLesson() {
  try{
    const response = await Axios.post('/api/student/getMyLesson',
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
    const response = await Axios.post('/api/student/getMyLesson',
    { query:{ status:Constant.LESSON_STATUS.FINISHED  }}); 
    const { data } = response;
    return data; 
   }catch(err){
     return { "code":Constant.RES_FAILED }
   }
}

export async function getCanceledLesson() {
  try{
    const response = await Axios.post('/api/student/getMyLesson',
    { query:{ status:Constant.LESSON_STATUS.CANCELED } });
    const { data } = response;
    return data; 
   }catch(err){
     return { "code":Constant.RES_FAILED }
   }
}


