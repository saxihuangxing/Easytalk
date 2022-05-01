const CommonUtil = {
    /**************************************获取URL上参数值************************************/
    getParamValue: function (url, name) {
      var regex = new RegExp(name + "=([^&]*)", "i");
      if (url.match(regex)) {
        return url.match(regex)[1];
      }
      return null;
    },
  
    /**
     *
     * @param {*} maps
     * @param {*} keyname
     * @param {*} valuename
     */
    generateMapToArray: function (maps, keyname, valuename) {
      var data = [];
      if (maps) {
        for (var index in maps) {
          let param = {};
          param[keyname] = index;
          param[valuename] = maps[index];
          data.push(param);
        }
      }
      return data;
    },
  
    /**
     * 将json数组 转换成Tree，select等需要的格式
     * @param {*} dataJson 原始Json数据
     * @param {*} valueItem 控件value值对应的原始item名称
     * @param {*} labelItem 控件标签内容对应的原始item名称
     * @param {*} disableItem 控件禁用项对应的原始item名称，注:不存在或不为真时，不填充
     */
    generateJsonToDataSource: function (dataJson, valueItem, labelItem, disableItem) {
      var data = [];
      if (dataJson) {
        dataJson.forEach((item) => {
          let param = {};
          param['value'] = item[valueItem];
          param['label'] = item[labelItem];
          if (typeof (disableItem) !== 'undefined') {
            if (typeof (item[disableItem]) !== 'undefined') {
              if(item[disableItem]===true || item==='true')
                param['disabled'] = item[disableItem];
            }
          }
          data.push(param);
        });
      }
      return data;
    },
  
    ganerateListFromTree : (orgData, list) => {
      if (orgData != null) {
        let meetType = typeof(orgData);
        if(meetType == "object" && orgData.constructor==Array) {
          orgData.forEach((item) => {
            list.push(item);
          });
        }else if(meetType == "object"){
          list.push(orgData);
        }else{
        }
  
      }
    },
  
    getCurrentPageDataList: function(list,page,pageSize){
      let min = (page - 1) * pageSize;
      let max = pageSize * page;
      let newList = [];
      if (list.length > min) {
        for (let i = min; i < max; i++) {
          if (typeof (list[i]) == 'undefined') {
            break;
          }
          newList.push(list[i]);
        }
      }
      return newList;
    },
  
      tranObjToArr: (obj) =>{
          let res = obj;
          if(typeof(obj) == 'object') {
              if (obj.constructor != Array){
                  res = [obj];
              }
          }
          return res;
      },
      urlEncode : (param, key, encode) =>{
          if (param==null) return '';
          var paramStr = '';
          var t = typeof (param);
          if (t == 'string' || t == 'number' || t == 'boolean') {
              paramStr += '&' + key + '='  + ((encode==null||encode) ? encodeURIComponent(param) : param);
          } else {
              for (var i in param) {
                  var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
                  paramStr += urlEncode(param[i], k, encode)
              }
          }
          return paramStr;
  
      },
  
      getQueryVariable : (variable) =>
      {
  
          var url  = window.location.toString();
          var query =  url.split("?")[1];
          var vars = query.split("&");
          for (var i=0;i<vars.length;i++) {
              var pair = vars[i].split("=");
              if(pair[0] == variable){return pair[1];}
          }
          return(false);
      },
  
      sortArray: (array, filed, isAscending ) => {
        array.sort(function(a, b){
          if(isAscending)
            return a[filed] - b[filed]
          else
           return  b[filed] - a[filed]
        });   
      }
  }
  
  
  export default CommonUtil;
  