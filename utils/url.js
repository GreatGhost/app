/***
 * 服务端有三个基础地址，根据身份不同来决定
 * 
 * 
***/

const config = require('./config')


const goodsOwner_sign_salt = 'Xcbkj_1&2^3,4.5ks%d*765XcB22Kj88rev_shipperintface'
const shipOwner_sign_salt = 'Xcbkj_1&2^3,4.5ks%d*765XcB22Kj88rev_shipownerintface'
const individualBusinuss_sign_salt = 'Xcbkj_1&2^3,4.5ks%d*765XcB22Kj88rev_carrierintface'

const host = config.env.debug ? 'http://60.190.249.111:8899/' : 'https://xcbwl.cn/'

const default_ver_id = '321'

const goodOwnerPath = 'rev_shipperintface/'
const shipOwnerPath = 'rev_shipownerintface/'
const individualBusinessPath = 'rev_carrierintface/'

const defaultGoodsOwnerUrl = host + goodOwnerPath
const defaultShipOwnerUrl = host + shipOwnerPath
const defaultIndividualBusinessUrl = host + individualBusinessPath

/**
 * 
 * 
*/
let tmpTrimVerId = false
function setURLVerID(ver_id) {
  config.setUserInfo({ver_id}) 
  restoreDefaultUrl()
}

function getURLVerId() {
  let ver_id = config.getUserInfo().user.ver_id  
  if (ver_id) {
    return ver_id
  }
  return default_ver_id
}

function needURLVer_id() {
  return config.env.debug !== true  && !tmpTrimVerId
}


function defaultUrl() {
  let retUrl = defaultGoodsOwnerUrl
  let pathStr = goodOwnerPath
  if (config.isShipOwner()) {
    retUrl = defaultShipOwnerUrl
    pathStr = shipOwnerPath
  } else if (config.isIndividualBusiness()) {
    retUrl =  defaultIndividualBusinessUrl
    pathStr = individualBusinessPath
  }
  if (needURLVer_id()) {
    let verId = getURLVerId()
    let originalPath = pathStr
    let freshPath = originalPath.replace('/', '_' + verId + '/')
    retUrl = retUrl.replace(originalPath, freshPath)
  }
  return retUrl
}


let baseUrlStr = defaultUrl()
function baseUrl() {
  return baseUrlStr
}

function useDiffPath(path) {
  tmpTrimVerId = true
  baseUrlStr = host + path
}

function restoreDefaultUrl() {
  tmpTrimVerId = false
  baseUrlStr = defaultUrl()
}

function updateBaseUrl(baseUrl) {
  if (baseUrl.length > 0) {
    baseUrlStr = baseUrl
  }
}

function getRequestSignSalt() {
  if (config.isShipOwner()) {
    return shipOwner_sign_salt
  } else if (config.isIndividualBusiness()) {
    return individualBusinuss_sign_salt
  }
  return goodsOwner_sign_salt
}

module.exports = {
  host:host,
  baseUrl: baseUrl,
  setURLVerID:setURLVerID,
  getURLVerId:getURLVerId,
  needURLVer_id:needURLVer_id,
  useDiffPath: useDiffPath,
  updateBaseUrl: updateBaseUrl,  
  restoreDefaultUrl: restoreDefaultUrl,
  getRequestSignSalt:getRequestSignSalt,
}