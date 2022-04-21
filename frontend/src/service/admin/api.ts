import Axios from 'axios';
import md5 from "md5";
import Qs from 'qs';
import Constant from '@/constant';

export interface AdminStructure{
  accountName:string,
  accountPassword:string,
}

export async function login( values:AdminStructure ) {
  const accountPassword = md5( values.accountPassword);
  const accountName = values.accountName;
  const params = {
    accountName,
    accountPassword,
    role:Constant.ROLE.ADMIN,
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

export async function getAllStudentInfo(projection) {
  const params = {
    projection
  };
  const res = await Axios.post('/api/student/getAllStudentInfo',params);
  if(res.status == 200){
    return res.data;
  }
  return null;
}