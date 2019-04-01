
const config = require('../../utils/config')
const url = require('../../utils/url')
const newApi = require('../../utils/newApi.js')
const app = getApp()

Page({
  data:{
    showAuthButton:true,
    showUserType:false,
    showChangeMobile:false,
    showCheckNum: false,

    needWxLogin:false,
    relaunchAppAfterWxAuth:false,
    resendRemain: 0,
    mobile:'',
    hidedMobile:'',
    hideMobile:'',
    checkList:['', '', '', ''],
    checkActionDisable:true,    
    positions: [{name: '我是船主', slogan:'上报空船信息，匹配海量优质货盘', id:config.User_Type_ShipOwner, image:'/resource/ship-owner.png'}, 
                {name: '我是货主', slogan:'发布货盘信息，快速匹配靠谱运力',id:config.User_Type_GoodsOwner, image:'/resource/goods-owner.png'}, 
                {name: '我是航运服务商', slogan:'专业的水运经纪人', id:config.User_Type_IndividualBusiness, image:'/resource/shiping-company.png'}]
  },
  onLoad: function(options) {
    if (options.showCheckNum) {      
      this.setData({showCheckNum:true, resendRemain: 59, showAuthButton: false})
      this.conuntCheckNumToZero()
    } else if (options.showAuthButton) {
      /**
       * 
       * this should be this very first page when user use this app. 
       * here we clean user data to make sure user has a fresh new world
       * before this was added, with a android phone, user del this app , relogin with another account, previouse user data was still there.       
       * 
      */
      config.clearUserData() 
      this.setData({showAuthButton:true})
    } else if (options.showChangeMobile) {
      this.setData({showChangeMobile:true, showAuthButton: false})
    } else if (options.showUserType) {
      this.setData({showUserType:true, showAuthButton: false})
    }
    if (options.mobile) {
      let mobile = options.mobile
      let hideMobile = mobile.substr(0, 3) + ' **** ' + mobile.substr(7, 4)       
      this.setData({mobile, hideMobile})
    }
    this.setData({needWxLogin:Boolean(options.needWxLogin) === true, relaunchAppAfterWxAuth: Boolean(options.relaunchAppAfterWxAuth) === true})
  },  
  getPhoneNumber: function(e) { //授权点击    
    if (e.detail.iv && e.detail.encryptedData) {      
      let obj = this    
      wx.showLoading({mask: true, title: '正在加载数据'})  
      newApi.wxDescrypt(e.detail.iv, e.detail.encryptedData).then(res => {        
        wx.hideLoading()
        if (obj.data.relaunchAppAfterWxAuth) {
          app.relaunch()
          return          
        }
        let descryptedData = res.obj        
        obj.data.mobile = res.obj.purePhoneNumber
        obj.data.hideMobile = obj.data.mobile.substr(0, 3) + ' **** ' + obj.data.mobile.substr(7, 4)               
        if (config.getUserInfo().user.user_id) {
          newApi.getNewFullUserInfo();
          wx.reLaunch({url:'/pages/index/index'})
        } else {
          wx.navigateTo({url: '/pages/loginPage/loginPage?showChangeMobile=true'})          
        }
      })
    } else if (this.data.relaunchAppAfterWxAuth !== true) {      
      wx.navigateTo({url: '/pages/loginPage/loginPage?showChangeMobile=true'})          
    } 
  },
  chooseUserType: function(e) {
    config.setUserInfo({user_type:e.currentTarget.dataset.id})    
    url.restoreDefaultUrl()
    let mobile = this.data.mobile
    if (mobile) {      
      this.getCheckNum({}, () => {
        wx.navigateTo({url:'/pages/loginPage/loginPage?showCheckNum=true&mobile='+mobile})
      })
    } else {
        wx.navigateTo({url:'/pages/loginPage/loginPage?showChangeMobile=true'})
    } 
  },
  getCheckNum: function(e, callBack) { //获取验证码跳转下一步         
    let mobile = this.data.mobile
    if (!mobile || mobile.length < 8) {      
      wx.showToast({title:"手机号码格式不对", icon:'none'})
      return;
    }
    this.data.mobile = mobile
    let obj = this
    wx.showLoading({mask: true, title: '正在获取验证码'})
    newApi.sendCheckCode(mobile).then(() => {
      wx.hideLoading()
      obj.setData({resendRemain:59})
      obj.conuntCheckNumToZero()
      wx.showToast({title:"验证码已经发送"})
      if (callBack) callBack()
    })
  }, 
  conuntCheckNumToZero: function() {
    let obj = this
    setInterval(() => {      
      let resendRemain = obj.data.resendRemain - 1
      obj.setData({resendRemain})
      if (resendRemain <= 0) {
        clearInterval()
      }
    }, 1000)
  },
  confirmAuth: function(e) {             
    // 在登陆成功后，这个信息一起被保存，这里不需要做额外的保存        
    let checkNum = this.data.checkList.join('')
    wx.showLoading({mask: true, title: '正在加载数据'}) 
    if (!this.data.mobile || this.data.mobile.length < 8) {      
      wx.showToast({title:"手机号码格式不对", icon:'none'})
      return;
    }
    if (!checkNum || checkNum.length <= 0) {      
      wx.showToast({title:"验证码不能为空", icon:'none'})
      return;
    } 
    newApi.loginWithMobile(this.data.mobile, checkNum).then(res => {
      wx.hideLoading()
      newApi.getNewFullUserInfo()
      wx.reLaunch({url:'/pages/index/index'})          
    })
  },
  inputChange: function(e) {
    if (e.detail) {
      var list = e.detail.value.split("").concat(['', '', '', '', '', ''])
      list = list.slice(0, 4)
      this.setData({
        checkList: list,
        checkActionDisable: e.detail.value.length < 4
      })
    }
  },

  jumpChangeMobile:function() {    
    wx.navigateTo({url: '/pages/loginPage/loginPage?showChangeMobile=true'})
  },
  mobileChange:function(e) {
    this.setData({mobile:e.detail.value})
  },  
})