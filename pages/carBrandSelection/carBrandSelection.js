import services from '../../utils/services.js'
let app = getApp();

Page({
  data: {
    hotList: [],//热门品牌
    alphabetList: [],//滚动条数组
    list: [],//品牌
    alpha: 'A',
    host: 'https://abs.heqiauto.com',
  },
  onLoad(option) {
    this.fetchBrands();
  },

  // 获取品牌列表
  fetchBrands() {
    wx.request({
      url: services.host + '/product/car-brand',
      success: (res) => {
        console.log(res)
        let data = res.data;
        if (data.success) {
          let result = data.data;
          this.setData({
            alphabetList: result.alphabet_list,
            list: result.list,
            hotList: result.hot_list
          })
        } else {
          console.log('获取品牌信息失败！');
        }
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  // 选择品牌事件
  chooseCarInfo(e) {
    let { brand_name } = e.currentTarget.dataset;
    wx.redirectTo({
      url: `/pages/carInfoSelection/carInfoSelection?brand_name=${brand_name}`
    })
  },

  // 点击滚动条事件
  handlerAlphaTap(e) {
    let { ap } = e.currentTarget.dataset;
    this.setData({ alpha: ap });
  },
})