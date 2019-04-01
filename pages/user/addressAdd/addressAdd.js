// pages/user/addressAdd/addressAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addInfoList:[
      {
        name:'收货人',
        type:'text',
        id:'consignee',
        placeholder:'应快递实名制规则，请填写收货人真实姓名'
      },
      {
        name:'手机号码',
        type:'number',
        id:'contact',
        placeholder:'请输入收货人手机号'
      },
      {
        name:'所在地区',
        type:'picker',
        id:'area',
        placeholder:'请选择地区'
      },
      {
        name:'详细地址',
        type:'text',
        id:'detailAddress',
        placeholder:'街道、楼牌号等'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  }
})