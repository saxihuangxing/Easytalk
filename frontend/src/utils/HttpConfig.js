import * as axios from 'axios'
//import axios from 'axios'
const TOKEN_KEY = 'EDU_ACCESS_TOKEN';
const DYNAMIC_MENU_CONFIG = "DynamicMenuConfig";
axios.defaults.withCredentials = true
axios.defaults.timeout = 10000
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

axios.interceptors.request.use(function (config){
    if (config.url.indexOf('logout') >=0 ) {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(DYNAMIC_MENU_CONFIG);
    }
    let token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
})

axios.interceptors.response.use(function (response){
    //对响应数据做操作
   // alert("222" + response.data);
    if(response.data.code === '403') {
        window.location.href = `/#/${response.data.role}/`;
        return Promise.reject(response);
    }
/*    if(response.data.edu_token) {
        sessionStorage.setItem(TOKEN_KEY, response.data.edu_token);
    }*/
/*    if(response.data.username){
        console.log('httpconfig ',response.data.username);
        sessionStorage.setItem('username', response.data.username);
    }*/
    return response;
}, function (error) {
    //对响应数据错误做操作
    return Promise.reject(error);
})

