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
    console.error("login err:",err);
    return {"code":Constant.RES_FAILED}
  }
}

export async function walletTopup( walletId:string, amount:Number ) {
  try{
   const response = await Axios.post('/api/admin/TopUpWallet', { walletId, amount }); 
   const { data } = response;
   return data; 
  }catch(err){
    console.error("walletTopup err:",err);
    return {"code":Constant.RES_FAILED}
  }
}

export async function walletDeduct( walletId:string, amount:Number ) {
  try{
   const response = await Axios.post('/api/admin/deductWallet', { walletId, amount }); 
   const { data } = response;
   return data; 
  }catch(err){
    console.error("walletTopup err:",err);
    return {"code":Constant.RES_FAILED}
  }
}


export async function getTopupApplyInfo( query,projection ) {
  try{
   const response = await Axios.post('/api/admin/getTopupApplyInfo', { query,projection }); 
   const { data } = response;
   if(data.code == Constant.RES_SUCCESS){
     return data.data
   }
  }catch(err){
    console.error("getTopupApplyInfo err:",err);
    return null;
  }
}

export async function setTopupApplyResult( id , approve ) {
  try{
   const response = await Axios.post('/api/admin/dealTopupApply', {id,approve }); 
   const { data } = response;
   return data;
  }catch(err){
    console.error("setTopupApplyResult err:",err);
    return null;
  }
}


export async function getLessonInfo( query,projection ) {
  try{
   const response = await Axios.post('/api/admin/getLessonInfo', { query,projection }); 
   const { data } = response;
   if(data.code == Constant.RES_SUCCESS){
     return data.data
   }
  }catch(err){
    console.error("getWalletInfo err:",err);
    return null;
  }
}


export async function getWalletInfo( query, projection ) {
  try{
   const response = await Axios.post('/api/admin/getWalletInfo', { query,projection }); 
   const { data } = response;
   if(data.code == Constant.RES_SUCCESS){
     return data.data
   }
  }catch(err){
    console.error("getWalletInfo err:",err);
    return null;
  }
}

export async function deleteStudent( studentId:string ) {
  try{
   const response = await Axios.post('/api/admin/deleteStudent', { studentId }); 
   const { data } = response;
   return data; 
  }catch(err){
    console.error("deleteStudent err:",err);
    return {"code":Constant.RES_FAILED}
  }
}

export async function setTutorStatus( tutorId:string, status:string ) {
  try{
   const response = await Axios.post('/api/admin/setTutorStatus', { tutorId,status }); 
   const { data } = response;
   return data; 
  }catch(err){
    console.error("setTutorStatus err:",err);
    return {"code":Constant.RES_FAILED}
  }
}