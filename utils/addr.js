const http = require('./httpRequest')
const addrDataUrl = require('./url.js').host + '/ftphome/config/addrList.json';
const newApi =require('./newApi')

let addrData = []
function getDockList(pro_code, city_code, area_code) {
    return newApi.getDockList(pro_code, city_code, area_code)    
}

function addDock(dock_name, pro, pro_code, city, city_code, area, area_code) {    
    return newApi.addDock(dock_name, pro, pro_code, city, city_code, area, area_code);
}

function getDock(dock_name){
    return newApi.getDockByName(dock_name);
}

function getProvinceList() {    
    if (addrData.length > 0) {
        return new Promise((resolve, reject) => {
             resolve(addrData.filter(item => item.level === 1))
        })
    }
    return getAddrJsonData().then(res => {
        addrData = res;
      return res.filter(item => item.level === 1)
    })
}

function getCityListOfProvince(province) {
    return  addrData.filter(item => item.level === 2 && item.sheng === province.sheng)    
}

function getAreaListOfCity(city) {
    return addrData.filter(item => item.level === 3 && item.sheng === city.sheng && item.di === city.di)    
}


function shortAddr(addr) {
    if (addr) {
        addr = addr.replace('省', '')
        addr = addr.replace('自治区', '')
        addr = addr.replace('特别行政区', '')
        addr = addr.replace('壮族', '')
        addr = addr.replace('回族', '')
        addr = addr.replace('维吾尔族', '')
        addr = addr.replace('维吾尔', '')

        addr = addr.replace('不限', '')        
        addr = addr.replace('市辖区', '')
        addr = addr.replace('市', '')
        
        addr = addr.replace('县', '')
        addr = addr.replace('区', '')
    }
    return addr
}
function shoortRace(addr){
    var str='阿昌族 傈僳族 白族 保安族 布朗族 布依族 朝鲜族 达斡尔族 傣族 德昂族 侗族 东乡族 独龙族 鄂伦春族 俄罗斯族  鄂温克族  高山族 仡佬族 哈尼族 哈萨克族 赫哲族 回族 基诺族 京族 景颇族 柯尔克孜族 拉祜族 黎族 僳僳族 珞巴族 满族 毛南族 门巴族 蒙古族 苗族 仫佬族 纳西族 怒族 普米族 羌族 撒拉族  畲族 水族 塔吉克族 塔塔尔族 土族 土家族 佤族 维吾尔族 乌兹别克族 锡伯族 瑶族 彝族 裕固族 藏族 壮族';
    if(addr){
        let arr=str.split(/\s+/);
        addr= addr.replace(' 省直辖县级 ',''); 
       addr= addr.replace('自治区','');
       addr= addr.replace('自治县','');
       addr= addr.replace('自治州','');
        for(let i=0;i<arr.length;i++){
            if(addr.indexOf(arr[i])>-1){
                addr=addr.replace(arr[i],'');
                continue;
            }
        }
    }
    return addr;
}
function getAddrData(){

    return getAddrJsonData().then(res => {
        //console.log(res);
        addrData = res;
      return res.filter(item => item.level!==4)
    })
}
/*
情况一：
北京_东城   -> 北京东城
浙江杭州_   -> 浙江杭州
浙江杭州上城 -> 杭州上城
浙江杭州全部 -> 浙江杭州

情况二：
省级:不限

情况三

浙江省全部

情况四 浙江省杭州市 西湖区 不限
*/
function shortItemsOfAddrWithoutDock(addrs) {
  let firstShort = shortAddr((addrs && addrs.length > 0) ? addrs[0].name : '')
    /* 情况二、三 */
    if(!firstShort){
          return {firstShort:'',secondShort:''}  
    }
  let secondShort = shortAddr((addrs && addrs.length > 1) ? addrs[1].name : '')
    if(firstShort&&!secondShort){
        return {firstShort:firstShort,secondShort:''}
    }

    let thirdShort =  addrs.length > 2 ? shortAddr(addrs[2].name) : ''


    /*  情况一*/
    if (thirdShort && secondShort) {
        if (thirdShort === secondShort) {
            return {firstShort, secondShort}
        }
        return {firstShort:secondShort, secondShort:thirdShort}
    }  else if (!thirdShort) {
        return {firstShort, secondShort}
    }  else  { // !secondShort
        return {firstShort:firstShort, secondShort:thirdShort}
    }  
}

module.exports = {
    getProvinceList:getProvinceList,
    getCityListOfProvince:getCityListOfProvince,
    getAreaListOfCity:getAreaListOfCity,
    getDockList:getDockList,
    addDock:addDock,
    shortAddr:shortAddr,
    shortItemsOfAddrWithoutDock: shortItemsOfAddrWithoutDock,
    getAddrJsonData:getAddrJsonData,
    addrData:addrData,
    getAddrData:getAddrData,
    getDock:getDock,
    shoortRace:shoortRace  
}


//////////////////////////////////// private function ////////////////////////////////////

function getAddrJsonData() {
    return new Promise((resolve, reject) => {           
        wx.downloadFile({
            url: addrDataUrl,
            success: resolve,
            fail:reject
        })
    }).then(res => {
        return new Promise((resolve, reject) => {
            if (res.tempFilePath) {
                let manager = wx.getFileSystemManager()
                manager.readFile({
                        filePath: res.tempFilePath,
                        encoding:'utf8',
                        success:resolve,
                        fail: reject})            
            } else {
                reject(new Error('存储参数错误'))
            }                
        })
    }).then(res => {
        return new Promise((resolve, reject) => {
            try {            
                let json = JSON.parse(res.data)
                addrData = json
                resolve(json)
            } catch(e) {   
                reject(e)
            }
        })
    })
}

