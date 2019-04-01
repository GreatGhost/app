const localStorage = require('./LocalStorage')

const AuthType_Personal = 1
const AuthType_Company = 2
const AuthType_Broker = 3

const Auth_Status_NotCommit = 0
const Auth_Status_WaitCheck = 1
const Auth_Status_Succeed = 2
const Auth_Status_Failed = 3


// 用户是刚注册服务商类型，类型为0，  如果认证个人个体户，会变成4，如果认证企业，会变成3
const User_Type_ShipOwner = 1
const User_Type_GoodsOwner = 2
const User_Type_ShipCompany = 3
const User_Type_IndividualBusiness = 4


const env = {
  debug: true,
  showLog: true, 
  versionStr: '0.1',
  pro_type:3, //端侧信息，指明是那个客户端发来的请求
}

const Ship_Types = {
    "1":'单机',
    "2":'拖队',
    "3":'驳船'
}

const Ship_CockpitPosition  = {
    "1":'前置',
    "2":'后置'
}

const Ship_HatchwayCover_Types = {
    "1":"无封舱",
    "2":"自动封舱",
    "3":"棚架",
    "4":"雨布"
}

const Ship_WaterGauge_Styles = {
    "1":"无",
    "2":"标准水尺",
    "3":"马钢水尺",
    "4":"武钢水尺",
    "5":"重钢水尺"
}

const Offcial_Tel = '400-182-5156'

/************************************* local store user info *************************************/
let userInfo = {
    wxUserInfo:{},
    user:{}
}

function clearUserData() {
  userInfo.user = {}
  saveUserInfoToStorage()
}

let hasLoadedUserInfo = false;
function getUserInfoFromLocalStorageSyncOnlyOnce() {  
    let data = wx.getStorageSync(localStorage.UserInfoKey);
    if (data) {
      _setUserInfo(data)
    }
}

function getUserInfoFromLocalStorage() {  
  let obj = this
  return new Promise((resolve, reject) => {    
    wx.getStorage({
      key: localStorage.UserInfoKey,    
      success: resolve,
      fail: reject
    })
  }).then(res => {
    _setUserInfo(res.data)
    return userInfo
  })
}

function saveUserInfoToStorage() {
  if (getUserInfo()) {    
    wx.setStorage({key: localStorage.UserInfoKey, data: getUserInfo()})
  }
}

function getUserInfo() {
  return userInfo
}

function _setUserInfo(data) {
  userInfo = data
}

function setUserInfo(data) {
  if (data.user_type && Number(data.user_type) === 0) { //“0”默认是服务商
    data.user_type = User_Type_IndividualBusiness
  }
  let user = userInfo.user
  let _data = Object.keys(data).reduce((map, key)=>{
      if(data[key]){
          map[key] = data[key];
      }
      return map;
  }, {});
  user = {...user, ..._data}
  userInfo.user = user
  userInfo.updateTime = (new Date()).getTime()
  saveUserInfoToStorage()
}

function setWxUserInfo(data) {
    let wxUserInfo = userInfo.wxUserInfo
    wxUserInfo = {...wxUserInfo, ...data}
    userInfo.wxUserInfo = wxUserInfo
    userInfo.updateTime = (new Date()).getTime()
    saveUserInfoToStorage()
} 

function userInfoIsValid() {
  if (!getUserInfo() ||  !getUserInfo().user.user_id) {
    return false
  } 
  let current = new Date()
  return current.getTime() - getUserInfo().updateTime  < 24 * 3600 * 1000
}

function hasLogin() {  
  let userId = getUserInfo().user.user_id  
  return (userId && userId.length > 0) === true
}

/************************************* auth status *************************************/
function isAuthSucceed() {
  let status1 = getUserInfo().user.aud_status
  return status1 && Number(status1) === Auth_Status_Succeed  
}

function hasAuthed() {
  let status1 = getUserInfo().user.aud_status
  return status1 && Number(status1) !== Auth_Status_NotCommit
}

function inAuthCheck() {
  let status1 = getUserInfo().user.aud_status
  return status1 && Number(status1) === Auth_Status_WaitCheck
}

function isAuthFailed() {
  let status1 = getUserInfo().user.aud_status
  return status1 && Number(status1) === Auth_Status_Failed
}

/************************************* auth type *************************************/
function hasCommitBaseAuthInfo() {  
  return isAuthPersonal() || isAuthCompany() || isAuthIB();
}

function updateAuthType(type) {  
  if (type > 0 && type <= AuthType_Broker) {
    setUserInfo({aud_type:type})  
  }
}

function isAuthPersonal() {  
  let type = getUserInfo().user.aud_type
  return type && Number(type) === AuthType_Personal
}

function isAuthCompany() { 
  let type = getUserInfo().user.aud_type
  return type && Number(type) === AuthType_Company
}

function isAuthIB() {
  let type = getUserInfo().user.aud_type
  return type && Number(type) === AuthType_Broker
}


/************************************* user type *************************************/
function isGoodsOwner() {  
  let type = getUserInfo().user.user_type
  return type && User_Type_GoodsOwner === Number(type)
}

function isShipOwner() { 
  let type = getUserInfo().user.user_type
  return type && User_Type_ShipOwner === Number(type)
}

function isIndividualBusiness() {
  let type = getUserInfo().user.user_type
  return type && (User_Type_IndividualBusiness === Number(type) || 0 === Number(type) || User_Type_ShipCompany === Number(type))
}

module.exports = {
    env:env,
    
    AuthType_Personal:AuthType_Personal,
    AuthType_Company:AuthType_Company,
    AuthType_Broker:AuthType_Broker,

    Auth_Status_NotCommit: Auth_Status_NotCommit,
    Auth_Status_WaitCheck: Auth_Status_WaitCheck,
    Auth_Status_Succeed: Auth_Status_Succeed,
    Auth_Status_Failed: Auth_Status_Failed,

    Ship_Types:Ship_Types,
    Ship_CockpitPosition:Ship_CockpitPosition,
    Ship_HatchwayCover_Types:Ship_HatchwayCover_Types,
    Ship_WaterGauge_Styles:Ship_WaterGauge_Styles,

    User_Type_ShipOwner:User_Type_ShipOwner,
    User_Type_GoodsOwner:User_Type_GoodsOwner,
    User_Type_ShipCompany:User_Type_ShipCompany,
    User_Type_IndividualBusiness:User_Type_IndividualBusiness,

    Offcial_Tel: Offcial_Tel,

    clearUserData:clearUserData,    
    getUserInfo:getUserInfo,
    setUserInfo:setUserInfo,
    userInfoIsValid:userInfoIsValid,
    setWxUserInfo:setWxUserInfo,
    getUserInfoFromLocalStorageSyncOnlyOnce:getUserInfoFromLocalStorageSyncOnlyOnce,
    getUserInfoFromLocalStorage:getUserInfoFromLocalStorage,
    hasLogin:hasLogin,
    
    hasAuthed:hasAuthed,
    isAuthSucceed:isAuthSucceed,
    inAuthCheck:inAuthCheck,
    isAuthFailed:isAuthFailed,
    
    updateAuthType: updateAuthType,
    hasCommitBaseAuthInfo:hasCommitBaseAuthInfo,
    isAuthCompany:isAuthCompany,
    isAuthPersonal:isAuthPersonal,
    isAuthIB:isAuthIB,
    
    isGoodsOwner:isGoodsOwner,
    isShipOwner:isShipOwner,
    isIndividualBusiness:isIndividualBusiness,
}