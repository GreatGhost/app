// components/headNav/headNav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nav:{
      type:Array,
      value:[],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectNav(e){
      let index=e.currentTarget.dataset.index;
      this.setData({
        navIndex:index
      })
    }
  }
})
