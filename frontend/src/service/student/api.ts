import Axios from 'axios';
import md5 from "md5";
import Qs from 'qs';
import Constant from '@/constant';

export interface StudentStructure{
  accountName:string,
  accountPassword:string,
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

export async function getAllTutorInfo(projection) {
  const params = {
    projection
  };
  const res = await Axios.post('/api/student/getAllTutorInfo',params);
  if(res.status == 200){
    return res.data;
  }
  return null;
}