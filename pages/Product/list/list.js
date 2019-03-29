// pages/Product/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs:['全部商品','生活日用','机械设备'],
    list:[
      {title:'老村长乐醇浓香型白酒 ',capacity:'500ml',price:'0.00~0.99元',imgPath:'/resource/images/index.png'}
    ]
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

  },
  getProductShow(){
    wx.navigateTo({
      url:'/pages/Product/show/show'
    });
  }
})