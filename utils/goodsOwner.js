const http = require('./httpRequest')
const config = require('./config')
const url = require('./url')

/**
 * 货主首页
 * latitude 纬度 
 * longitude 经度
*/
function getHomeContent() {    
    return http.httpPost('overt/home/findIndex')
}

function addGoodsType(goods_name) {
    return http.httpPost('other/addGoods', {goods_name}).then(res => {
        res.name = res.goods_name
        return res
    })
}

/**
 * 运力列表筛选(筛选合适的船主、公司、经纪人)
 * 
*/
function handleShipList(list) {
  return list.map(tmp => {
    tmp.isShipOwner = tmp.transport_user_type === config.User_Type_ShipOwner.toString()
    tmp.isCompany = tmp.transport_user_type === config.User_Type_ShipCompany.toString()
    tmp.isBroker = tmp.transport_user_type === config.User_Type_IndividualBusiness.toString()

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
}
function filterProperShips(filters) {
    return http.httpPost('overt/home/findTransportList', filters).then(res => {      
      res.list = handleShipList(res.list)   
      return res 
    })
}


/**
 * 运力详情
 * 拥有者可能是船主、公司、经纪人任意一种
 * 不同类型，返回的数据不同
 * 
*/
function getShipDetail(transport_user_id) {
    url.useDiffPath('rev_version/')
    let promise = http.httpPost('other/findTransportDetail', {transport_user_id})
    url.restoreDefaultUrl()
    return promise
}

/**
 * 获取热门货物
*/
function getHotGoods() {
    return http.httpPost('other/findSelectData', {type:1}).then(res => {
        if (res.goods_list && res.goods_list.length > 0) {
            let goods_list = res.goods_list.map(tmp => {
                tmp.name = tmp.goods_name
                return tmp
            })
            res.goods_list = goods_list
        }
        return res
    })
}

/**
 * 发货
 * 
*/
function addGoods(goodsInfo) {    
    return http.httpPost('mine/order/saveorder', goodsInfo)
}



function getOrderList(pagenum) {
    return http.httpPost('mine/order/findOrderList', {pagenum})
}

function getOrderDetail(order_id) {    
    // let url = 'mine/order/findOrderDetail'
    // if (config.isShipOwner()) {
    //     url = 'overt/order/findOrderDetail'
    // }
    url.useDiffPath('rev_version/')
    let promise = http.httpPost('other/findOrderDetail', {order_id})
    url.restoreDefaultUrl()
    return promise
}

function cancelOrder(order_id) {
    return http.httpPost('mine/order/cancelOrder', {order_id})
}


module.exports = {
    handleShipList,
    getHomeContent:getHomeContent,
    filterProperShips:filterProperShips,
    getShipDetail: getShipDetail,
    getHotGoods:getHotGoods,
    getOrderList:getOrderList,
    getOrderDetail:getOrderDetail,
    cancelOrder: cancelOrder,    
    addGoods:addGoods, 
    addGoodsType:addGoodsType, 
}