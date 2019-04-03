// pages/Product/list/list.js
const activityApi = require('../../../utils/activityApi');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: ['全部商品', '生活日用', '机械设备'],
    /*     list:[
          {title:'老村长乐醇浓香型白酒 ',capacity:'500ml',price:'0.00~0.99元',imgPath:'/resource/images/index.png'}
        ], */
    list: [],
    pagesize: 10,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList();
  },

  /* 跳转商品列表 */
  getProductList() {
    let pagesize = this.data.pagesize;
    let page = this.data.page;
    let list = this.data.list;
    let param = {
      size: pagesize,
      current: page
    }
    let that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'none'
    });
    activityApi.productList(param).then(res => {
      wx.hideLoading();
      if (res.data && res.data.records) {
        let records = res.data.records;
        list = list.concat(records);
        that.setData({
          page: page + 1,
          isEmpty: list && list.length <= 0,
          list,
          loadMore: list && list.length < res.data.total
        })
      }

    });
  },

  /* 跳转商品详情 */
  getProductShow(e) {
    let data = e.currentTarget.dataset.data;
    data = JSON.stringify(data);
    wx.navigateTo({
      url: '/pages/Product/showFromStore/showFromStore?data=' + data
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loadMore) {
      this.getProductList();
    }
  },

})