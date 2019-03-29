const {httpPost,httpGet}=require('./http.js');


/**
 * 获取首页活动信息
 */

export const getIndexActivity=()=>{
    return httpGet('/api/activity-info/initIndex')
}

/* 商品详情 */
export const getProductShow=()=>{
    return httpGet('/api/agi/show')
}


/* 好友助力详情 */
export const getFriendHelp=()=>{
    return httpGet('/api/friend-help/index')
}

/* 保存好友助力 */
export const saveFriendInfo=()=>{
    return httpGet('/api/friend-help/saveInfo')
}


/*收货地址分页查询  */
export const getAddress=()=>{
    return httpGet('/api/shipping-address/index')
}

/* 新增/更新信息 */
export const saveUpdate=()=>{
    return httpGet('/api/shipping-address/saveOrUpdate')
}

