import Axios from 'axios';
import Constant from '@/constant';
import config from '@/config/systemConfig';
let systemConfig = config;
async function initSystemConfig(){
    const res = await Axios.post('/api/common/getSystemConfig');
    if(res.status == 200){
      const { data } = res;
      if(data.code == Constant.RES_SUCCESS){
         try{
             systemConfig = JSON.parse(data.data);
         }catch(err){
             console.error("get systemconfig err:" + err);
         }
      }
    }
}

initSystemConfig();

export  function getSystemConfig(){
    if(!systemConfig){
        initSystemConfig();
    }
    return systemConfig;
}
