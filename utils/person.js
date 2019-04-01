const localStorage = require('./LocalStorage.js')
const http = require('./httpRequest')
const url = require('./url')
const config = require('./config')


/**
 * wxUserInfoFormat = {vatarUrl:"",
city:"",
country:"China",
gender:1,
language:"zh_CN",
nickName:"",
province:""}
*/

/**
 * 
 * userInfo = {
  "user_name": "",
  "flag_first_login_success": "0",
  "user_type": "2",
  "aud_type": "0",
  "head_pic": "",
  "aud_status": "0",
  "user_id": "",
  "rtcode": "0000",
  "rtmsg": "非首次登陆"
}
*/

////////////////////////////////////////////////////////////////////////////////////////////////
function updateUserAvatar(head_pic, isCompanyLogo) {
  let parameter = {head_pic}
  if (isCompanyLogo) {
    parameter = {logo_pic:head_pic}
  }
  return http.httpPost('mine/other/updateHeadpic', parameter).then(res => {
    config.getUserInfo().user.head_pic = head_pic
    return res
  })
}

function getMobile() {
  return config.getUserInfo().user.contact_phone // 不需要读取微信，这里总会有这个信息
}

function getNick() {
  let nick = ''
  if (config.getUserInfo().wxUserInfo && config.getUserInfo().wxUserInfo.nickName) {
    nick = config.getUserInfo().wxUserInfo.nickName
  }
  if (config.getUserInfo().user.user_name) {
    nick = config.getUserInfo().user.user_name
  }
  return nick
}

function getHeadPic() {
  let pic = ''
  if (config.getUserInfo().wxUserInfo && config.getUserInfo().wxUserInfo.avatarUrl) {
    pic = config.getUserInfo().wxUserInfo.avatarUrl
  }
  if (config.getUserInfo().user.head_pic) {
    pic = config.getUserInfo().user.head_pic
  }
  return pic
}

function getLogoPic() {
  return config.getUserInfo().user.logo_pic
}

function getContactPerson() {
  return config.getUserInfo().user.contact_person;
}

////////////////////////////////////////////////////////////////////////////////////////////////
function getCheckNumber(moblephone, useAudio) {
  return http.httpPost('login/saveVercode', {send_type: useAudio ? 2 : 1, ver_type: 1, moblephone}).then(res => {
    config.getUserInfo().user.contact_phone = moblephone
  })
}

function login(moblephone, ver_code) {
  return http.httpPost('login/login', {moblephone, ver_code}).then(res => {
    config.setUserInfo(res)
    config.setUserInfo({account:moblephone});
    return res
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 获取运单列表
 * 
*/
function getOrderList() {
  return http.httpPost('mine/order/findOrderPailist')
}

/**
 * 获取运单详情
 * 
*/
function getOrderDetail(orderId) {
  return http.httpPost('mine/order/findOrderDetail')
}

////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 查看认证状态
*/
/*
    aud_type: （0：未认证，1：个人，2：企业，3：个体户)
    aud_status:（0：未提交，1：待审核，2：已审核通过，3：审核未通过）
*/
function getAuthInfo() {    
    return http.httpPost('mine/authent/findAudInfo').then(res => {
      config.setUserInfo(res)
      return res
    })
}

function auth(authInfo) {
    return http.httpPost('mine/authent/updateAudInfo', authInfo) 
}


/**
 * 
 * wx operation
*/
function wxLogin(code) {  
  url.useDiffPath('rev_version/')
  let ret = http.httpPost('other/wxLogin', {code}).then(res => {        
    config.setWxUserInfo({openid: res.openid})
    return res
  })
  url.restoreDefaultUrl()
  return ret
}

function wxDescrypt(iv, encryptedData) {
  iv = encodeURIComponent(iv)
  encryptedData = encodeURIComponent(encryptedData)    
  url.useDiffPath('rev_version/')
  let ret = http.httpPost('other/decode', {iv, encryptedData}).then(res => {
    config.setUserInfo(res)
    url.restoreDefaultUrl()
    return res
  })
  url.restoreDefaultUrl()
  return ret
}

function getWXQr(path) {
  url.useDiffPath('rev_version/')
  let ret = http.httpPost('weixin/getwxacode', {path, width:300})
  url.restoreDefaultUrl()
  return ret
}

module.exports = {  
  getAuthInfo:getAuthInfo,
  auth:auth,

  
  login:login,
  wxLogin:wxLogin,
  wxDescrypt:wxDescrypt,
  getCheckNumber: getCheckNumber,
  getMobile:getMobile,
  getNick:getNick,
  getLogoPic:getLogoPic,
  getHeadPic:getHeadPic,
  getContactPerson:getContactPerson,
  
  updateUserAvatar:updateUserAvatar,

  getWXQr:getWXQr,
}