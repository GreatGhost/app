const urlUtil = require('./url')
const md5 = require('./md5')
const time = require('./time')
const config = require('./config')
const utility = require('./utility');
/**
 * 
 * 跟server的基础通信封装。
 * 封装统一的请求好处很多：
 * 1. 好监控
 * 2. 好调试
 * 3. 好替换其他请求你方案
 * 4. 请求服务端的细节处理可以统一维护
 * 5. 方便进行全局的统一默认处理
 * 
 */

function httpRequest(url, method, data) {
  url = urlUtil.baseUrl() + url  
  if (data) {
    data = Object.keys(data).reduce((map, key) => {
      if (data[key] && data[key].toString() != 'undefined') {
        map[key] = data[key]
      }
      return map
    }, {})
  }
  let rdata = requestData()
  rdata = {...data, ...rdata} 
  utility.logger.log(url)
  utility.logger.log(rdata)
  return new Promise(
    (resolve, reject) => {      
      wx.request({url:url,
        method: method,
        header:{'content-type': 'application/x-www-form-urlencoded'},
        data: rdata,
        success: (res) => {
          utility.logger.log(res)
          if (res.data) {
            if (res.data.rtcode === '0000') {
              resolve(res.data)
            } else {
              let errMaps = {
                '1000':new Error(new Error(res.data.rtmsg ? res.data.rtmsg : '数据请求失败')),
                '100000':new Error(new Error(res.data.rtmsg ? res.data.rtmsg : '数据请求失败')),
                '1005':new Error(new Error('sign失败'))
              }
              if (res.data.rtcode === '100000' && res.data.ver_id) {
                urlUtil.setURLVerID(res.data.ver_id)
              }
              if(res.data.rtcode==='1002'){
                wx.reLaunch({ url: '/pages/loginPage/loginPage?showAuthButton=true&needWxLogin=true'});
              }
              let err =  errMaps[res.data.rtcode]  
              err = err ? err :   errMaps['1000']    
              utility.logger.error(err)
              wx.showToast({title:err.message ? err.message : '请求失败', icon:'none'})
              throw err                            
            }
          } else {
            let err = new Error('无数据')            
            wx.showToast({title:err.message ? err.message : '请求失败', icon:'none'})              
            throw err
          }
        },
        fail: (err) => {
          wx.showToast({title:err.message ? err.message : '请求失败', icon:'none'})
          throw err
        }
      })
    }
  ).catch(e => {
    console.error(e)
  })
}

function uploadFile(filePath) {  
  return new Promise((resolve, reject) => {
    let uploadurl = urlUtil.baseUrl()+'other/uploadPic'
    wx.uploadFile({
      url: uploadurl,
      filePath: filePath,
      name: 'file',
      formData:requestData(),
      success: resolve,
      fail: reject
    })
  })
  .then(res => {
    return res.data
  })
  .then(res => {
    return new Promise((resolve, reject) => {
      res = JSON.parse(res)
      if (res.rtcode === '0000') {
        resolve(res.file)
      } else {
        let errMaps = {
          '1000':new Error(new Error(res.data.rtmsg ? res.data.rtmsg : '数据请求失败')),
          '100000':new Error(new Error(res.data.rtmsg ? res.data.rtmsg : '请刷新数据')),
          '1005':new Error(new Error('sign失败'))
        }
        if (res.data.rtcode === '100000' && res.data.ver_id) {
          urlUtil.setURLVerID(res.data.ver_id)
        }
        let err =  errMaps[res.data.rtcode]  
        err = err ? err :   errMaps['1000']    
        utility.logger.error(err)
        wx.showToast({title: '图片上传失败', icon: 'none'})
        throw err
      }
    })
  }).catch(e => {
    wx.showToast({title: err.message ? err.message : '上传失败', icon: 'none'})
    console.error(e)
  })
}

function httpGet(url, data) {  
  return httpRequest(url, "GET", data)
}

function httpPost(url, data) {  
  return httpRequest(url, "POST", data)
}

function requestData() {
  try {
    let user = config.getUserInfo().user
    let Token=config.getUserInfo().user.Token
    let utime = time.getRequestFormatedDateString(new Date(), 'yyyyMMddhhmmss')
    let userId = (user && user.user_id) ? user.user_id : ''
    let ukey = urlUtil.getRequestSignSalt()
    let str = 'ukey='+ukey+'&user_id='+userId+'&utime='+utime    
    let sign = md5.hexMD5(str)    
    let info = wx.getSystemInfoSync()
    let person = require('./person')
    let openid = config.getUserInfo().wxUserInfo.openid
    let app_version = config.env.versionStr;
    
    let data = {
      pro_type:config.env.pro_type,
      entra_type:2,
      utime,
      sign, 
      app_version,
      user_id:userId,
      Token:Token,
      device_brand:info.brand,
      system_model:info.model,
      wx_version:info.version,
      wxsdk_version:info.SDKVersion,
      system_version:info.system,
      phonetype:info.platform === 'ios' ? 2 : 1,
    }
    if (openid && openid !== 'null') {
      data.openid = openid
    }
    if (urlUtil.needURLVer_id()) {      
      data.ver_id = urlUtil.getURLVerId()
    }
    return data
  }  catch(e) {
    utility.logger.error(e)
    return {}
  }
}



module.exports = {
  httpGet: httpGet,
  httpPost: httpPost,
  uploadFile:uploadFile
}