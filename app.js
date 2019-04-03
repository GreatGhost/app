//app.js
const config=require('./utils/config');
const newApi =require('./utils/newApi');
App({
  onLaunch: function (options) {
    this.refreshToken();
    // 展示本地存储能
        // a.登录 登录校验机制 1.本地(捞后复制给内存) 2.内存检验 3.是否超过24小时 4.session是否过期
    // b.以上4步通过，newApi重新获取用户后刷新用户内存 跳转首页、或者非登录页
    wx.login({
      success: res => {
        console.log(res);
        newApi.wxLogin(res.code)
      }
    });
    config.getUserInfoFromLocalStorageSyncOnlyOnce(); 
    if (config.hasLogin() && config.userInfoIsValid()) {
      wx.checkSession({
        success(){

          newApi.getNewFullUserInfo();
          if (options.path && !options.path.includes('loginPage')) {  
            wx.reLaunch({url:options.path});       
          }  else {
            wx.reLaunch({url:'/pages/index/index'}); 
          }
        }
      })

    }
  },
  refreshToken(){
    let time=12 * 60 * 60 * 1000;
    setInterval(function(){
      newApi.refreshToken().then(res=>{
        if(res.rtcode=='0000'){
          let data={Token:res.Token};
          config.setUserInfo(data);
        }

      })
    },time); 
  },
  globalData: {
    userInfo: null
  }
})