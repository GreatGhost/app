const urlUtil = require('./url')
const md5 = require('./md5')
const time = require('./time')
const config = require('./config')
const utility = require('./utility');

function httpRequest(url, method, data) {
  url = 'http://60.190.249.111:8883' + url;
  if (data) {
    data = Object.keys(data).reduce((map, key) => {
      if (data[key] && data[key].toString() != 'undefined') {
        map[key] = data[key]
      }
      return map
    }, {})
  }
  let rdata = requestData();
  rdata = {
    ...data,
    ...rdata
  };
  console.log(rdata);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: rdata,
      success(res) {
        if (res.data) {
          if (res.data.code === '8001') {
            resolve(res.data)
          } else {
            let errMaps = {
              '1000': new Error(new Error(res.data.rtmsg ? res.data.rtmsg : '数据请求失败')),
              '100000': new Error(new Error(res.data.rtmsg ? res.data.rtmsg : '数据请求失败')),
              '1005': new Error(new Error('sign失败'))
            }
            if (res.data.rtcode === '100000' && res.data.ver_id) {
              urlUtil.setURLVerID(res.data.ver_id)
            }
            if (res.data.rtcode === '1002') {
              wx.reLaunch({
                url: '/pages/loginPage/loginPage?showAuthButton=true&needWxLogin=true'
              });
            }
            let err = errMaps[res.data.rtcode]
            err = err ? err : errMaps['1000']
            utility.logger.error(err)
            wx.showToast({
              title: err.message ? err.message : '请求失败',
              icon: 'none'
            })
            throw err
          }
        } else {
          let err = new Error('无数据')
          wx.showToast({
            title: err.message ? err.message : '请求失败',
            icon: 'none'
          })
          throw err
        }
      }
    })
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
    let Token = config.getUserInfo().user.Token
    let utime = time.getRequestFormatedDateString(new Date(), 'yyyyMMddhhmmss')
    let userId = (user && user.user_id) ? user.user_id : ''
    let ukey = urlUtil.getRequestSignSalt()
    let str = 'ukey=' + ukey + '&user_id=' + userId + '&utime=' + utime
    let sign = md5.hexMD5(str)
    let info = wx.getSystemInfoSync()
    let person = require('./person')
    let openid = config.getUserInfo().wxUserInfo.openid
    let app_version = config.env.versionStr;

    let data = {
      pro_type: config.env.pro_type,
      entra_type: 2,
      utime,
      sign,
      app_version,
      user_id: userId,
      Token: Token,
      device_brand: info.brand,
      system_model: info.model,
      wx_version: info.version,
      wxsdk_version: info.SDKVersion,
      system_version: info.system,
      phonetype: info.platform === 'ios' ? 2 : 1,
    };
    if (openid && openid !== 'null') {
      data.openid = openid;
    }
    if (urlUtil.needURLVer_id()) {
      data.ver_id = urlUtil.getURLVerId()
    }
    return data
  } catch (e) {
    utility.logger.error(e)
    return {}
  }
}

/* 首页-活动列表 */
function initIndex() {
  let promise = httpGet('/api/activity-info/initIndex');
  return promise
}

/* 商品详情 */
function productShow(obj) {
  let promise = httpGet('/api/agi/show', obj);
  return promise
}

/* 商品列表 */
function productList(obj) {
  let promise = httpGet('/api/goods-info/index', obj);
  return promise
}


/* 根据商品id查询商品详情信息 */
function productShowById(obj) {
  let promise = httpGet('/api/goods-and-pic/queryGoodsAndPic', obj);
  return promise
}

/* 收货地址分页查询 */

function shipAddressList(obj) {
  let promise = httpPost('/api/shipping-address/index', obj);
  return promise
}



/* 收货地址保存 更新 */

function saveShipAddress(obj) {
  let promise = httpPost('/api/shipping-address/saveOrUpdate', obj);
  return promise
}

/* 用户出价成功列表 */

function userBidList(obj) {
  let promise = httpGet('/api/user-bid-result/index', obj);
  return promise
}
/* 保存好友助力信息 */
function saveUserAssist(obj) {
  let promise = httpPost('/api/friend-help/saveInfo', obj);
  return promise
}

/* 好友助力查询 */

function userAssistList(obj) {
  let promise = httpGet('/api/friend-help/index', obj);
  return promise
}

module.exports = {
  initIndex,
  productShow,
  productList,
  productShowById,
  shipAddressList,
  saveShipAddress,
  userBidList,
  saveUserAssist,
  userAssistList
}