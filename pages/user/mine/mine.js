// pages/user/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mineList:[
      {
        name:'我的订单',id:'orderList',imgIcon:'/resource/images/tab-bar-index.png'
      },
      {
        name:'地址管理',id:'address',imgIcon:'/resource/images/tab-bar-index.png'
      },
      {
        name:'联系客服',id:'contact',imgIcon:'/resource/images/tab-bar-index.png',contactPhone:'400-1245-3235'
      },
      {
        name:'设置',id:'setting',imgIcon:'/resource/images/tab-bar-index.png'
      },      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },
  getUserInfo: function () {
    var that = this
    _getUserInfo();
    function _getUserInfo() {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            userInfo: res.userInfo
          })
          that.update()
        }
      })
    }
  },

  //单击用户列表项
  tapMineItem(e){
    let data=e.currentTarget.dataset.data;
    console.log(data);
    switch(data.id){
      case 'orderList':
      wx.switchTab({
        url:"/pages/Product/list/list"
      });
      break;
      case 'address':
      wx.navigateTo({
        url:'/pages/user/addressList/addressList'
      });
      break;
      case 'contact':
      wx.makePhoneCall({
        phoneNumber: data.contactPhone,
      })
      break; 
      default:
      break;

    }
  }
})