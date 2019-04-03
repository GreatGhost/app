// pages/Order/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs:['全部','待付款','待收货','已完成'],
    list:[
      {title:'老村长乐醇浓香型白酒 ',mount:'2',price:'0.00~0.99元',imgPath:'/resource/images/index.png',orderStatus:'待付款',orderId:'13241324124a'},
      {title:'老村长乐醇浓香型白酒 ',mount:'2',price:'0.00~0.99元',imgPath:'/resource/images/index.png',orderStatus:'待收货',orderId:'13241324124a'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goOrderDetail(){
    wx.navigateTo({
      url:'/pages/Order/show/show'
    })
  }
})