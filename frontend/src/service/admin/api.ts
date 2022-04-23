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