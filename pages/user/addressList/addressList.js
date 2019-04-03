// pages/user/addressList/addressList.js

const activityApi = require('../../../utils/activityApi');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  add(){
    wx.navigateTo({
      url:"/pages/user/addressAdd/addressAdd"
    })
  },
  getList(){
    activityApi.shipAddressList().then(res=>{
      console.log(res);
    })
  }
})