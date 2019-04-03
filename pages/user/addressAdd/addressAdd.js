// pages/user/addressAdd/addressAdd.js
//var address = require("../../../mock.js");
var addr=require('../../../utils/addr')
Page({

      /**
    * 控件当前显示的数据
    * provinces:所有省份
    * citys 选择省对应的所有市,
    * areas 选择市对应的所有区
    * areaInfo：点击确定时选择的省市县结果
    * animationAddressMenu：动画
    * addressMenuIsShow：是否可见
    */

  data: {
    addInfoList:[
      {
        name:'收货人',
        type:'text',
        id:'consignee',
        placeholder:'请输入收货人姓名'
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
    ],
    addressIsShow:false,

    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
            // 默认联动显示北京;
/*         var id = address.provinces[0].id
        this.setData({
        provinces: address.provinces,
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
        }) */
        let that=this;
        addr.getAddrJsonData().then(res=>{
          var provinces=res.filter(tmp=>tmp.level=='1');
          var citys=res.filter(item=>{
            return item.level === 2 && item.sheng === provinces[0].sheng
          })
          var areas=res.filter(item=>{
            return item.level === 3 && item.sheng === citys[0].sheng && item.di== citys[0].di;
          })
          that.setData({
            provinces,
            citys,
            areas,
            addrData:res
          });
        });
  },
  showAddress(){
    let addressIsShow=this.data.addressIsShow;
    //console.log(addressIsShow);
    this.setData({addressIsShow:true})

  },

  // 点击所在地区弹出选择框
  select: function (e) {
    // 如果已经显示，不在执行显示动画
    if (this.data.addressMenuIsShow) {
    return false
    } else {
        // 执行显示动画
        this.startAddressAnimation(true)
    }
},

// 执行动画
startAddressAnimation: function (isShow) {
    if (isShow) {
        // vh是用来表示尺寸的单位，高度全屏是100vh
        this.animation.translateY(0 + 'vh').step()
     } else {
            this.animation.translateY(40 + 'vh').step()
      }
    this.setData({
        animationAddressMenu: this.animation.export(),
        addressMenuIsShow: isShow,
    })
},
// 点击地区选择取消按钮
cityCancel: function (e) {
    this.startAddressAnimation(false)
},
// 点击地区选择确定按钮
citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    var addInfoList=this.data.addInfoList;
    this.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + '·' + that.data.citys[value[1]].name + '·' + that.data.areas[value[2]].name
    addInfoList.forEach(tmp=>{
      if(tmp.id=='area'){
        tmp.value=areaInfo
      }
    })
    that.setData({
        areaInfo: areaInfo,
        addInfoList:addInfoList
    })
},
// 处理省市县联动逻辑
cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var addrData=this.data.addrData;
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
        let citys= addrData.filter(item=>item.level==2 && item.sheng==provinces[provinceNum].sheng);
        let areas=addrData.filter(item=>item.level==3 && item.sheng==citys[0].sheng && item.di==citys[0].di)
        this.setData({
            value: [provinceNum, 0, 0],
            citys:citys,
            areas:areas,
        });
    } else if (this.data.value[1] != cityNum) {
    // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
        var id = citys[cityNum].id;
        let areas=addrData.filter(item=>item.level==3 && item.sheng==citys[cityNum].sheng && item.di==citys[cityNum].di);
        this.setData({
            value: [provinceNum, cityNum, 0],
            areas: areas
        });
    } else {
        // 滑动选择了区
        this.setData({
            value: [provinceNum, cityNum, countyNum]
        });
    }
},
onShow: function () {
    var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
    });
    this.animation = animation
}
})