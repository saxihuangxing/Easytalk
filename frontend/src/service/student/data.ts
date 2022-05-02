import { getSelfInfo } from  "./api";

let myInfo = null; 

export async function studentInit() {
    try{
        myInfo = await getSelfInfo();
        let str_jsonData = JSON.stringify(myInfo);
        localStorage.setItem('myInfo', str_jsonData); 
    }catch(e){
        console.log(`studentInit err: ${e}`)
    }
}

export function getMyInfo(){
    if(myInfo == null){
        let str_jsonData = localStorage.getItem('myInfo');
        myInfo = JSON.parse(str_jsonData);
    }
    return myInfo;
}
