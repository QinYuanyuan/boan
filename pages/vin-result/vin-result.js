let app = getApp();

Page({

  data: {
    vin: '',
    num: 5,
    modelLists: [],
    noResult: false,
  },

  onLoad(options) {
    let mdoelLists = app.globalData.allModelLists;
    this.setData({
      num: mdoelLists.length,
      modelLists: mdoelLists,
      vin: options.vin,
      noResult: mdoelLists.length === 0 ? true : false,
    })
  },

  

  selectModelFn(e) {
    let pages = getCurrentPages();
    pages[0].setData({
      vin: '',
      newCarValue: e.currentTarget.dataset.value,
    })
    app.globalData.modelInfo = [];
    app.globalData.modelInfo.push(this.data.modelLists[e.currentTarget.dataset.index]);
    wx.navigateBack({delta: 100});
  },
  
  goBackFn() {
    let pages = getCurrentPages();
    pages[0].setData({
      vin: '',
      sCurrentPrice: '',
      showGif: false,
    })
    wx.navigateBack({ delta: 100 });
  },
})