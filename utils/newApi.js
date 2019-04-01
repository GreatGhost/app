const http = require('./httpRequest')
const config = require('./config')
const url = require('./url')
const addr = require('./addr')
const time = require('./time.js')
const handleShipList = require('./goodsOwner.js').handleShipList;
const handleOrderList = require('./shipOwner.js').handleOrderList;

// ship owner
export function updateShipInfo(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipowner/mine/ship/saveShipInfor', obj)
    url.restoreDefaultUrl()
    return promise
}

export function getMMSI(shipNum) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipowner/mine/authent/findMmsiNumber?ship_num='+shipNum)
    url.restoreDefaultUrl()
    return promise
}

export function getShipInfo() {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipowner/mine/ship/findShipInfor')
    url.restoreDefaultUrl()
    return promise
}

function getShipOwnerUserInfo() {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipowner/mine/authent/findBasicInfor')
    url.restoreDefaultUrl()
    return promise 
}

//查询码头
export function getDockByName(dock_name){
  url.useDiffPath('rev_wechatinterface/');
  let promise=http.httpPost('merge/area/findDockListByDockName',{dock_name});
  url.restoreDefaultUrl()
  return promise 
}

export function getDockList(pro_code, city_code, area_code) {  
  url.useDiffPath('rev_wechatinterface/');
  let promise=http.httpPost('merge/area/findDockList', {pro_code, city_code, area_code})
  url.restoreDefaultUrl()
  return promise 
}

export function addDock(dock_name, pro, pro_code, city, city_code, area, area_code) {    
  url.useDiffPath('rev_wechatinterface/');
  let promise=http.httpPost('merge/area/addDock', {dock_name, pro, pro_code, city, city_code, area, area_code})
  url.restoreDefaultUrl()
  return promise 
}


// 基本信息完善
function finishShipOwnerInfo1(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipowner/mine/authent/updateBasicInfor', obj)
    url.restoreDefaultUrl()
    return promise    
}
// 完善个人资料
function finishShipOwnerInfo2(obj) {  
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipowner/mine/authent/updateUserInfor', obj)
    url.restoreDefaultUrl()
    return promise  
}
//更新订单
export function updateGoods(goodsInfo){
    console.log(goodsInfo);
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipper/order/updateOrder',goodsInfo)
    url.restoreDefaultUrl()
    return promise  
}
// goods owner
function getGoodsOwnerrUserInfo() {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipper/mine/backInfor')
    url.restoreDefaultUrl()
    return promise  
}

function finishGoodsOwnerrInfo1(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipper/mine/complete', obj)
    url.restoreDefaultUrl()
    return promise    
}

function finishGoodsOwnerrInfo2(obj) {  
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('shipper/mine/myProfile', obj)
    url.restoreDefaultUrl()
    return promise  
}
// service
function getCarrierUserInfo() {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('carrier/mine/backInfor')
    url.restoreDefaultUrl()
    return promise  
}

function finishCarrierInfo1(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('carrier/mine/complete', obj)
    url.restoreDefaultUrl()
    return promise    
}

function finishCarrierInfo2(obj) {  
    url.useDiffPath('rev_wechatinterface/')
    let promise = http.httpPost('carrier/mine/myProfile', obj)
    url.restoreDefaultUrl()
    return promise  
}



// 暴露的接口
export function getUserInfo() {
    if (config.isGoodsOwner()) {
        return getGoodsOwnerrUserInfo();      
    } else if (config.isShipOwner()) {
        return getShipOwnerUserInfo();
    } else {
        return getCarrierUserInfo();
    }
}

export function finishBaseInfo(obj) {
    if (config.isGoodsOwner()) {
        return finishGoodsOwnerrInfo1(obj);
    } else if (config.isShipOwner()) {
        return finishShipOwnerInfo1(obj);
    } else {
        return finishCarrierInfo1(obj);
    }
}

export function updateUserInfo(obj) {
    if (config.isGoodsOwner()) {
        return finishGoodsOwnerrInfo2(obj);
    } else if (config.isShipOwner()) {
        return finishShipOwnerInfo2(obj);
    } else {
        return finishCarrierInfo2(obj);
    }
}


export function findGoods(parameter) {  
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/home/findOrderList', parameter).then(res => {
    let order_list = res.order_list
    order_list.forEach(tmp => {
      tmp.isPerson = tmp.aud_type.toString() === config.AuthType_Personal.toString()
      tmp.isCompany = tmp.aud_type.toString() === config.AuthType_Company.toString()
      tmp.isBroker = tmp.aud_type.toString() === config.AuthType_Broker.toString()

      if (tmp.aud_status && tmp.aud_status.toString() === config.Auth_Status_Succeed.toString()) {
        if (tmp.isPerson) {
          tmp.authTags = [{ name: '个人认证', cssid: 'personal-tag' }]
        } else if (tmp.isCompany) {
          tmp.authTags = [{ name: '企业认证', cssid: 'company-tag' }]
        } else if (tmp.isBroker) {
          tmp.authTags = [{ name: '个体户认证', cssid: 'ib-tag' }]
        }
      } else {
        tmp.authTags = [{ name: '未认证', cssid: 'invalid-tag' }]
      }

      tmp.head_pic = tmp.head_pic ? tmp.head_pic : '/resource/default-head-pic.png'
      tmp.shortStartProName = addr.shortAddr(tmp.start_dock_pro_name ? tmp.start_dock_pro_name : '')
      tmp.shortStartCityName = addr.shortAddr(tmp.start_dock_city_name ? tmp.start_dock_city_name : '')
      tmp.shortStartAreaName = addr.shortAddr(tmp.start_dock_area_name ? tmp.start_dock_area_name : '')
      tmp.shortEndProName = addr.shortAddr(tmp.end_dock_pro_name ? tmp.end_dock_pro_name : '')
      tmp.shortEndCityName = addr.shortAddr(tmp.end_dock_city_name ? tmp.end_dock_city_name : '')
      tmp.shortEndAreaName = addr.shortAddr(tmp.end_dock_area_name ? tmp.end_dock_area_name : '')

      let createDate = time.yyyyMMddhhmmssToDate(tmp.create_time)
      if (createDate) {
        tmp.timeStr = time.dateToHumanReadableTimeStr(createDate)
      }
      let tags = []
      if (tmp.flag_invoice && tmp.flag_invoice.toString() === '1') tags.push({ name: '需要发票' })
      if (tmp.handle_cycle && Number(tmp.handle_cycle) > 0) tags.push({ name: '装卸' + tmp.handle_cycle.toString() + '天' })
      if (tmp.settle_type && tmp.settle_type.length > 0) tags.push({ name: tmp.settle_type })
      if (tmp.pay_type && tmp.pay_type.length > 0) tags.push({ name: tmp.pay_type })
      tmp.tags = tags

      let timneStr = ''
      if (tmp.upload_start_date) {
        timneStr = time.getRequestFormatedDateString(time.yyyyMMddhhmmssToDate(tmp.upload_start_date), 'MM-dd')
      }
      if (tmp.upload_handle_cycle && Number(tmp.upload_handle_cycle) > 0) {
        timneStr = timneStr + ' +' + tmp.upload_handle_cycle + '天'
      }
      tmp.uploadGoodsStr = timneStr

      return tmp
    })
    res.order_list = order_list
    return res
  })
  url.restoreDefaultUrl()
  return promise  
}

export function findShips(parameter) {
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/home/findTransportList', parameter).then(res => {
    let list = res.list.map(tmp => {
      tmp.isShipOwner = tmp.transport_user_type === config.User_Type_ShipOwner.toString()
      tmp.isCompany = tmp.transport_user_type === config.User_Type_ShipCompany.toString()
      tmp.isBrokerIB = tmp.transport_user_type === config.User_Type_IndividualBusiness.toString() && tmp.aud_type === config.AuthType_Broker.toString()
      tmp.isBrokerPerson = tmp.transport_user_type === config.User_Type_IndividualBusiness.toString() && tmp.aud_type === config.AuthType_Personal.toString()

      tmp.head_pic = tmp.head_pic ? tmp.head_pic : '/resource/default-head-pic.png'

      if (tmp.aud_status === config.Auth_Status_Succeed.toString()) {
        if (tmp.aud_type && tmp.aud_type === config.AuthType_Personal.toString()) {
          tmp.tags = [{ name: '个人认证', cssid: 'personal-tag' }]
        } else if (tmp.aud_type && tmp.aud_type === config.AuthType_Company.toString()) {
          tmp.tags = [{ name: '企业认证', cssid: 'company-tag' }]
        } else {
          tmp.tags = [{ name: '个体户认证', cssid: 'ib-tag' }]
        }
      } else {
        tmp.invalidTags = [{ name: '未认证', cssid: 'invalid-tag' }]
      }
      return tmp
    })
    res.list = list
    return res
  })
  url.restoreDefaultUrl()
  return promise
}

export function getFullUserInfo() {
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/mine/authent/findAudInfor').then(res => {
    config.setUserInfo(res)
    return res    
  })
  url.restoreDefaultUrl()
  return promise  
}

// user config info
const config_data_type_GoodsList  = 1
const config_data_type_ShipsList  = 2
const config_data_type_AddrList   = 3
export function getIndexConfigList() {
  //默认获取运力和热门地区，如果是船主，获取货盘和热门地区
  let types = [2,3]
  if (config.isShipOwner()) {
    types = [1,3]
  } else if (config.isIndividualBusiness()) {
    types = [1, 2, 3]
  }
  url.useDiffPath('rev_wechatinterface/')
  let user_type = config.getUserInfo().user.user_type;
  user_type = user_type == '4' ? '3' : user_type;

  let parameter = {
    port_type: user_type,
    data_types: types.map(item => item.toString()).join(",")
  }
  let promise = http.httpPost('merge/operdata/findOperDataList', parameter).then(res => {
    if (res.oper_transport_list) {
      res.oper_transport_list = handleShipList(res.oper_transport_list);
    }
    if (res.oper_order_list) {
      handleOrderList(res.oper_order_list)
    }
    return res;
  })
  url.restoreDefaultUrl()
  return promise  
}


/**
 * 全新的登陆注册接口，包括微信和手机验证码的
 * */ 

/**
 * send_type:1：短信发送 2：语音发送
 * ver_type:1：登录/注册 4：解绑手机号 5：绑定手机号
*/
export function sendCheckCode(mobile) {  
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/manage/user/saveVerCode', {send_type:1, ver_type: 1, account:mobile})
  url.restoreDefaultUrl()
  return promise
}

export function loginWithMobile(mobile, code) {
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/manage/user/login', {ver_code: code, account:mobile}).then(res => {
    config.setUserInfo(res)
    return res
  })
  url.restoreDefaultUrl()
  return promise
}

export function wxLogin(js_code) {  
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/manage/user/wechatLogin', {js_code}).then(res => {
    config.setWxUserInfo({openid: res.openid})
    return res
  })
  url.restoreDefaultUrl()
  return promise
}

export function wxDescrypt(iv, encryptedData) {
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/manage/user/decode', {iv, encryptedData}).then(res => {    
    config.setUserInfo(res)
    return res
  })
  url.restoreDefaultUrl()
  return promise
}

/**
 * 新登陆体系中获取个人信息
*/
export function getNewFullUserInfo() {
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/mine/authent/findNewAudInfor').then(res => {
    config.setUserInfo(res)
    return res    
  })
  url.restoreDefaultUrl()
  return promise  
}



/**
 * 刷新Token
*/
export function refreshToken() {
  url.useDiffPath('rev_wechatinterface/')
  let promise = http.httpPost('merge/manage/user/refreshToken');
  url.restoreDefaultUrl()
  return promise
}