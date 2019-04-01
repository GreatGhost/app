const http = require('./httpRequest')
const url = require('./url')
const config = require('./config')
const addr = require('./addr')
const time = require('./time')

function handleOrderList(order_list) {
  (order_list ? order_list : []).forEach(tmp => {
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
      // tmp.authTags = [{ name: '未认证', cssid: 'invalid-tag' }]
    }

    tmp.head_pic = tmp.head_pic ? tmp.head_pic : '/resource/default-head-pic.png'
    tmp.shortStartProName = addr.shortAddr(tmp.start_dock_pro_name)
    tmp.shortStartCityName = addr.shortAddr(tmp.start_dock_city_name)
    tmp.shortStartAreaName = addr.shortAddr(tmp.start_dock_area_name)
    tmp.shortEndProName = addr.shortAddr(tmp.end_dock_pro_name)
    tmp.shortEndCityName = addr.shortAddr(tmp.end_dock_city_name)
    tmp.shortEndAreaName = addr.shortAddr(tmp.end_dock_area_name)

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
      timneStr = time.getRequestFormatedDateString(time.yyyyMMddhhmmssToDate(tmp.upload_start_date), 'yyyy-MM-dd')
    }
    // if (tmp.upload_handle_cycle && Number(tmp.upload_handle_cycle) > 0) {
    //   timneStr = timneStr + ' +' + tmp.upload_handle_cycle + '天'
    // }
    tmp.uploadGoodsStr = timneStr

    return tmp
  })
}
function findGoods(data) {
    return http.httpPost('overt/home/findOrderList', data).then(res => {
      handleOrderList(res.order_list)
      return res
    })
}

function getGoodsDetail(order_id) {
    return http.httpPost('overt/order/findOrderDetail', {order_id})
}

function addEmptyShip(data) {
    return http.httpPost('mine/emptyship/save',data)  
}

function getEmptyInfo() {
    return http.httpPost('mine/emptyship/find')
}

function getEmptyInfoWithId(emptyship_id) {
    url.useDiffPath('rev_version/')
    let promise = http.httpPost('other/findEmptyshipDetail', {emptyship_id})
    url.restoreDefaultUrl()
    return promise
}

module.exports = {    
    findGoods,  
    handleOrderList,
    getGoodsDetail,
    getEmptyInfo,
    getEmptyInfoWithId,
    addEmptyShip,
}