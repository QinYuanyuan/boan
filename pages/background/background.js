import services from '../../utils/services.js';

let host = services.host;

let app = getApp();
Page({
  data: {
    timer: '',
    pageType: '',
    inputValue: '',
  },
  onLoad: function (options) {
    this.setData({
      pageType: options.pageType ? options.pageType : '',
    })
    if (!this.data.pageType) {
      let timer = setTimeout(() => {
        this.toIndex();
      }, 3000)
      this.setData({ timer: timer })
    }
  },
  toIndex() {
    clearTimeout(this.data.timer)
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  inputEvent(event) {//input输入时触发的事件
    let value = event.detail.value.replace(/\s+/g, "").toUpperCase();
    let cursor = event.detail.cursor;
    this.data.inputValue = value;
    if (this.data.inputValue.length === 17) {
      const reVIN = /^[A-Z0-9]{17}$/;
      if (reVIN.test(this.data.inputValue)) {
        this.getModelInfo();
      }
    }
    return {
      value,
      cursor
    }
  },
  confirmEvent(event) {//点击键盘上的完成按钮
    let value = event.detail.value.replace(/\s+/g, "").toUpperCase();
    this.setData({
      inputValue: value,
    })
    if (this.data.inputValue.length === 17) {
      const reVIN = /^[A-Z0-9]{17}$/;
      if(reVIN.test(this.data.inputValue)){
        this.getModelInfo();
      }
    }
  },
  // 通过vin获取车型信息
  getModelInfo() {
    app.globalData.modelInfo = [];
    app.globalData.allModelLists = [];
    wx.request({
      // url: `http://192.168.1.113/api/product/vin?vin=${this.data.vin}`,
      url: host + `/product/vin?vin=${this.data.inputValue}`,
      method: 'GET',
      success: (res) => {
        let result = res.data;
        if (result.success) {
          if (result.data.length === 1) {//存在一条车型
            app.globalData.modelInfo = result.data;
            let pages = getCurrentPages();
            pages[0].setData({
              vin: '',
              newCarValue: result.data[0].NewCarValue,
            })
            wx.navigateBack({
              delta: 1,
            })
          } else if (result.data.length > 1) {//存在多条车型
            app.globalData.allModelLists = result.data;
            wx.navigateTo({
              url: `/pages/vin-result/vin-result?vin=${this.data.inputValue}`,
            })
          }
        } else {
          console.log('success为false', res.data);
          wx.navigateTo({
            url: `/pages/vin-result/vin-result?vin=${this.data.inputValue}`,
          })
        }
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
})