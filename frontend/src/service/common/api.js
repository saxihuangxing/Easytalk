import Axios from 'axios';
import Constant from '@/constant';

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