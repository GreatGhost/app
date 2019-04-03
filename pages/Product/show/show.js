// pages/Product/show/show.js
var WxParse = require('../../../wxParse/wxParse.js');
const activityApi=require('../../../utils/activityApi');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    //存储商品信息
    detail:{
      name:'老村长乐醇浓香型白酒',
      marketPrice:'9.99元',
      QrCode:'官方嗨友群',
      region:'0.00~0.99元'
    },
    successBitList:[
      {head_pic:'',message:'吴...操用0.01元购买成功',time:'3分钟前'},
      {head_pic:'',message:'吴...操用0.01元购买成功',time:'3分钟前'},
      {head_pic:'',message:'吴...操用0.01元购买成功',time:'3分钟前'},
    ],
    addressList:[
      {username:'李白',mobile:'11',addr:'1234'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.data){
      let data=JSON.parse(options.data);
      console.log(data);
      this.getProductDetail(data);
    }

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
  getProductDetail(data){

    
    //let productExtTxt2='<p><br/></p><p><img src="http://img.baidu.com/hi/jx2/j_0081.gif"/><img src="http://img.baidu.com/hi/jx2/j_0076.gif"/></p><p>测<span style="background-color: rgb(255, 0, 0);">试富文本编辑器转微信小程序功能</span></p><p><span style="border: 1px solid rgb(0, 0, 0);">测试富文本编辑器转微信小程序功能1</span></p><p><span style="color: rgb(0, 176, 240);">测试富文本编辑器转微信小程序功能2</span></p><p><span style="text-decoration: underline;">测试富文本编辑器转微信小程序功能3</span></p><p>测试富文本编辑器转微信小程序功能4</p><p><strong>测试富文本编辑器转微信小程序功能5</strong><br/></p>'
    let productExtTxt2='<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554097473969&di=7147110dd1feb1df4024008af58d143b&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F01%2F00%2F5156f3da8104518.jpg" /><br/><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554097473969&di=7147110dd1feb1df4024008af58d143b&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F01%2F00%2F5156f3da8104518.jpg" /><br/><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554097473969&di=7147110dd1feb1df4024008af58d143b&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F01%2F00%2F5156f3da8104518.jpg" />'
    let that=this;
    let time1=　new Date("Jun 2,2017");
    let time2=new Date();
    /*** WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)*/ 
    var temp = WxParse.wxParse('article', 'html',productExtTxt2, that, 5);
      
    that.setData({nodes:productExtTxt2}); 
    let param={
      activityId:data.activityId,
      goodsId:data.id
    }
    activityApi.productShow(param).then(res=>{
      console.log(res);
    })
  },
  goBid(){
    wx.navigateTo({
      url: "/pages/Product/bid/bid",
    })
  },
  chooseAddr(){
    console.log(1)
  }
})