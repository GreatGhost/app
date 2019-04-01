const httpRequest = require("./httpRequest")
const url = require('./url')


/**
 * 首页活动
*/
export function getShipList(obj) {
    url.useDiffPath('rev_wechatinterface/')
    let promise = httpRequest.httpGet('merge/manage/find/shipList',obj);
    url.restoreDefaultUrl();
    return promise; 
}