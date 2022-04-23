import { getSelfInfo } from  "./api";

let myInfo = null; 

export async function studentInit() {
    try{
        myInfo = await getSelfInfo();
        console.log(" myInfo = " + JSON.stringify(myInfo));
    }catch(e){
        console.log(`studentInit err: ${e}`)
    }
}

export function getMyInfo(){
    return myInfo;
}
