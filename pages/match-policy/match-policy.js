import services from '../../utils/services.js'

let app = getApp();
Page({

  data: {
    matchResult: {},//匹配产品的结果

    logoUrl: '',//logo
    carModelStr: '',//车型信息
    province: '',//省份
    firstDate: '',//上牌日期
    distance: '',//行驶里程
    currentPrice: '',//市场现价
    oneYearPrice: '',//一年价格
    twoYearPrice: '',
    threeYearPrice: '',
    product: {},//产品时间、价格信息

    host: 'https://abs.heqiauto.com',
  },

  onLoad: function (options) {
    this.initDataFn();
  },

  initDataFn() {
    this.setData({
      matchResult: app.globalData.matchResult,
    })
    let data = app.globalData.matchResult;
    this.setData({
      logoUrl: data.series.brand_logo_url,
      carModelStr: data.series.brand_name +" " + data.series.sub_brand_name + " " + data.series.series_name,
      province: data.province_name,
      firstDate: data.register_date,
      distance: data.drive_mileage,
      currentPrice: data.evaluate_price,
      oneYearPrice: data.products[0].price,
      twoYearPrice: data.products[1].price,
      threeYearPrice: data.products[2].price,

    })
  },

  // 联系方式
  makePhoneFn() {
    wx.makePhoneCall({
      phoneNumber: '4000686905',
    })
  },

})