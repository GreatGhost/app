const httpRequest = require("./httpRequest")
const url = require('./url')


export const settle_type_values = [{name:'卸货前', value:"1"}, {name:'卸货后', value:"2"}];
export const pay_type_values = [{name:'现金', value:"1"}, {name:'汇款', value:"2"}];
export const flag_invoice_value = [{name:'不开票', value:'0'}, {name:'开票', value:'1'}];

/**
 * 联系人
*/
export function getContactPersonList(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/find/contactList',obj)
    url.restoreDefaultUrl()
    return promise  
}

export function addContactPerson(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/note/person/addPerson',obj)
    url.restoreDefaultUrl()
    return promise  
}

export function updateContactPerson(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/note/person/updatePersonById',obj)
    url.restoreDefaultUrl()
    return promise  
}

export function delContactPerson(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/note/person/deletePersonById',obj);
    url.restoreDefaultUrl();
    return promise;  
}

/**
 * 船只
*/
export function getShipList(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/find/shipList',obj);
    url.restoreDefaultUrl();
    return promise; 
}

export function addShip(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/note/carry/addCarry',obj);
    url.restoreDefaultUrl();
    return promise;  
}

export function updateShip(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/note/carry/updateCarryById',obj);
    url.restoreDefaultUrl();
    return promise;  
}

export function delShip(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/note/carry/deleteCarryById',obj);
    url.restoreDefaultUrl();
    return promise; 
}

/**
 * 货单
*/
export function getOrderDetail(order_id) {    
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/find/orderDetail', {order_id})
    url.restoreDefaultUrl()
    return promise
}

export function getOrderList() { 
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/find/orderList').then(res => res.orderList)
    url.restoreDefaultUrl()
    return promise
}

export function addOrder(obj) {   
    url.useDiffPath('rev_wechatinterface/');
    let promise = httpRequest.httpPost('merge/manage/note/order/addOrderAndCarrys', obj)
    url.restoreDefaultUrl();
    return promise;
}

export function updateOrder(obj) {       
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/note/order/updateOrderAndCarrys', obj)
    url.restoreDefaultUrl()
    return promise  
}

export function delOrder(id) { 
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpPost('merge/manage/note/order/closeOrderById', {id})
    url.restoreDefaultUrl()
    return promise   
}