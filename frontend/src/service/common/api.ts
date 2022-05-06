import Axios from 'axios';
import Constant from '@/constant';
import { ModifyPassWordStru } from './data';
import md5 from 'md5';

export async function getAllTutorInfo(query,projection) {
    const params = {
      projection,
      query
    };
    const res = await Axios.post('/api/common/getAllTutorInfo',params);
    if(res.status == 200){
      return res.data;
    }
    return null;
}


export async function getTutorInfoById(id,projection) {
  const params = {
    projection,
    query:{ id }
  };
  const res = await Axios.post('/api/common/getOneTutorInfo',params);
  if(res.status == 200){
    return res.data;
  }
  return null;
}

export async function getAllStudentInfo(projection) {
  const params = {
    projection
  };
  let res = await Axios.post('/api/common/getAllStudentInfo',params);
  if(res.status == 200){
    res = res.data;
    if(res.code == Constant.RES_SUCCESS){
      return res.data;
    }
  }
  return null;
}

export async function getStudentById(id,projection) {
  const params = {
    projection,
    query:{ id }
  };
  const res = await Axios.post('/api/common/getOneStudentInfo',params);
  if(res.status == 200){
    return res.data;
  }
  return null;
}

export async function modifyPassword(params:ModifyPassWordStru) {
  params.oldPsw = md5( params.oldPsw );
  params.newPsw = md5( params.newPsw );
  const res = await Axios.post('/api/common/modifyPassword',{ params });
  if(res.status == 200){
    return res.data;
  }
  return null;
}