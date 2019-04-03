// pages/Order/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{
      status:'等待付款',
      lastTime:'23小时23分钟',
      imgPath:'/resource/images/index.png',
      title:'老村长乐醇浓香型白酒',
      price:'6.8',
      mount:'2',
      orderTime:'2019.03.20 10:40',
      orderId:'1234567789078',
      sendType:'顺丰速运: 234488585333',
      payment:'微信支付',
      account:'100'
    },
    userInfo:{
      username:'叶先生',
      mobile:'18968780961',
      addr:'浙江杭州市拱墅区中国(杭州)智慧信息产业园K座303'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})