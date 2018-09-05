import services from '../../utils/services.js'
let app = getApp();

Page({
  data: {
    vehicle: {},
    seriesList: [],
  },

  onLoad(options) {
    this.setData({ vehicle: options });
    this.fetchData();
  },
  
  fetchData() {
    let { brand_name } = this.data.vehicle;
    wx.request({
      url: services.host + '/product/car-series?brandName=' + brand_name,
      success: (res) => {
        console.log(res);
        this.setData({ seriesList: res.data.data });
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  // 删除品牌
  deleteBrand() {
    wx.redirectTo({
      url: `/pages/carBrandSelection/carBrandSelection`
    })
  },

  // 选择车系
  chooseSeries(e) {
    let { sub_brand_name, series_id, series_name } = e.currentTarget.dataset;
    this.setData({
      'vehicle.sub_brand_name': sub_brand_name,
      'vehicle.series_id': series_id,
      'vehicle.series_name': series_name,
    });

    let { brand_name } = this.data.vehicle;
    let pages = getCurrentPages();
    let releasePage = pages[pages.length - 2];
    let detail = `${brand_name} ${sub_brand_name} ${series_name}`;

    console.log(releasePage)
    releasePage.setData({
      'vehicle.brand_name': brand_name,
      'vehicle.sub_brand_name': sub_brand_name,
      'vehicle.series_id': series_id,
      'vehicle.series_name': series_name,
      carModelInfo: detail,
      correctModel: true,
    })
    releasePage.enableMatchBtn();
    wx.navigateBack({
      delta: pages.length - 2
    })
  },

  // 删除车系
  deleteSeries() {
    this.setData({
      'vehicle.series_id': '',
      'vehicle.series_name': '',
      'vehicle.sub_brand_name': '',
    });
  },
})