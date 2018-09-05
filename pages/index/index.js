import services from '../../utils/services.js';
import QQMapWX from '../../libs/qqmap-wx-jssdk.js';

let host = services.host;
let app = getApp();
let qqmapsdk;

Page({

  data: {
    sLocation: '请选择所在城市', // 城市
    range: [],// 城市数据
    region: 0,//picker中选择的城市的下标

    vehicle: {},//用与选择车型时判断跳到品牌页还是车型页

    firstDateData: [],//首次上牌日期  二维数组
    yearAry: [],
    monthAry: [],
    monthNums: 0,//选择的上牌日期距离现在有多少个整数月
    dateRegion: [0, 0],
    sFirstDate: '',//首次的上牌日期

    sDistance: '',//行驶里程
    sCurrentPrice: '',//车辆现价
    newCarValue: '',//查出来的车辆现价
    showDistanceWarn: false,//行驶里程超出范围时的提示信息
    showPriceWarn: false,//市场现价超出范围的提示信息
    showPriceTop: false,//市场现价的上限
    enableMatchBtn: false,//匹配按钮是否可用

    correctProvince: false,//省份填写是否符合要求
    correctModel: false,//车型填写是否符合要求
    correctFirstDate: false,//上牌日期填写是否符合要求
    correctDistance: false,//行驶里程填写是否符合要求
    correctCurrentPrice: false,//市场现价填写是否符合要求

    vin: '',//用户输入的vin
    showGif: false,//正在查询中的提示框
    showSuccess: false,//查询成功的提示框
  },

  onLoad(options) {
    qqmapsdk = new QQMapWX({
      key: 'U4BBZ-U7R3D-RSA4C-HKNWE-QWHNS-NVFL5'
    })
    this.getLocation();
    this.getCityData();
    this.getFirstDateData();
  },
  onShow() {
    this.setData({ 
      showGif: false,
      showSuccess: false,
    });
    if (this.data.newCarValue) {//全局的modelInfo存在说明已经通过vin查询过车型信息，直接计算现价
      this.setData({ newCarValue: '' })
      this.getCurrentPrice();
    }
  },

  // 获取市场现价
  getCurrentPrice() {
    let modelInfo = app.globalData.modelInfo;
    if (modelInfo.length === 1) {
      let price = modelInfo[0].NewCarValue / 10000 * (1 - 0.006 * this.data.monthNums);
      console.log('获取的市场现价',price)
      if (price > 115) {
        this.setData({
          showGif: false,
          showPriceWarn: true,
          showPriceTop: true,
          sCurrentPrice: price.toFixed(2),
        })
      } else if (price < 1.53){
        this.setData({
          showGif: false,
          showPriceWarn: true,
          showPriceTop: false,
          sCurrentPrice: price.toFixed(2),
        })
      } else {
        this.setData({
          sCurrentPrice: price.toFixed(2),
          showPriceWarn: false,
          showGif: false,
          showSuccess: true,
        })
        setTimeout(() => {
          this.setData({ showSuccess: false })
        }, 1000);
      }

      if (this.data.sCurrentPrice <= 115 && this.data.sCurrentPrice >= 1.53) {
        this.setData({ correctCurrentPrice: true })
      } else {
        this.setData({ correctCurrentPrice: false })
      }
      this.enableMatchBtn();
    }
  },

  // 获取地理位置
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: (res) => {
            this.setData({
              sLocation: res.result.address_component.province,
              correctProvince: true
            })
            this.enableMatchBtn();
          },
          fail: (err) => {
            console.log('通过经纬度获取城市信息失败', err);
          }
        });
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  // 获取城市数据
  getCityData() {
    wx.request({
      url: host + '/product/province',
      success: (res) => {
        let data = res.data;
        if (data.success) {
          this.setData({
            range: data.data,// picker组件中的range属性值  二维数组
          })
        }
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  // 选择省份触发
  bindRegionChange(e) {
    let { value } = e.detail;//  { value: 1}
    this.setData({
      region: value,
      sLocation: this.data.range[value],
      correctProvince: true,
    })
    this.enableMatchBtn();
  },

  //  首次上牌日期的数据
  getFirstDateData() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let startYear = currentYear - 10;
    let yearAry = [], monthAry = [], firstDateData = [];
    // 计算上牌日期中的年份
    for (let i = startYear; i <= currentYear; i++) {
      yearAry.push(i + '年');
    }
    firstDateData.push(yearAry);

    // 计算上牌日期中的月份
    for (let i = currentMonth + 1; i <= 12; i++) {
      monthAry.push(i + '月');
    }
    firstDateData.push(monthAry);

    this.setData({
      firstDateData,
      yearAry,
      monthAry,
    })
  },
  // 选择日期触发
  bindDateChange(e) {
    let { value } = e.detail;
    this.setData({ dateRegion: value });
    let year = this.data.yearAry[value[0]];
    let month = this.data.monthAry[value[1]];//当前选择的月
    month = parseInt(month);
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let currentDate = new Date().getDate();
    let monthNums;
    //在121个月之前
    if (this.data.dateRegion[0] === 0) {
      if (month < currentMonth + 1) {
        let firstDateData = [];
        firstDateData.push(this.data.yearAry);
        let month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        let monthAry = month.slice(currentMonth);
        firstDateData.push(monthAry);
        let selectMonth = parseInt(monthAry[0]);

        if (selectMonth < 10) { selectMonth = '0' + selectMonth }
        if (currentDate > 15) {
          monthNums = (currentYear - parseInt(year)) * 12 + (currentMonth + 1 - selectMonth + 1)
        } else {
          monthNums = (currentYear - parseInt(year)) * 12 + (currentMonth + 1 - selectMonth)
        }
        if ((parseInt(year) + '-' + selectMonth) !== this.data.sFirstDate) {
          this.setData({ 
            sCurrentPrice: '', 
            showPriceWarn: false,
            correctCurrentPrice: false
          })
        }
        this.setData({
          firstDateData: firstDateData,
          monthAry,
          dateRegion: [0, 0],
          sFirstDate: parseInt(year) + '-' + selectMonth,
          monthNums,
        })
        this.enableMatchBtn();
        return;
      }
    }
    // 在121个月之后
    if (this.data.dateRegion[0] === 10) {
      let firstDateData = [];
      firstDateData.push(this.data.yearAry);
      let monthTotal = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      let monthAry = monthTotal.slice(0, currentMonth + 1);
      firstDateData.push(monthAry);
      // let selectMonth = parseInt(monthAry[0]);
      // if (selectMonth < 10) { selectMonth = '0' + selectMonth }
      this.setData({
        firstDateData: firstDateData,
        monthAry,
        // dateRegion: [10, selectMonth - 1],
        dateRegion: [10, month - 1],
      })
      if (month >= currentMonth + 1) {
        if (currentDate > 15) {
          monthNums = (currentYear - parseInt(year)) * 12 + (currentMonth + 1 - month + 1);
        } else {
          monthNums = (currentYear - parseInt(year)) * 12 + (currentMonth + 1 - month);
        }
        if ((parseInt(year) + '-' + month) !== this.data.sFirstDate) {
          this.setData({ 
            sCurrentPrice: '', 
            showPriceWarn: false,
            correctCurrentPrice: false,
          })
        }
        if (month < 10) { month = '0' + month; }
        this.setData({
          sFirstDate: parseInt(year) + '-' + month,
          
          correctFirstDate: true,
          monthNums,
        })
        this.enableMatchBtn();
        return;
      }
    }

    // 选择的是中间的8年
    if (this.data.dateRegion[0] > 0 && this.data.dateRegion[0] < 10) {
      let firstDateData = [];
      firstDateData.push(this.data.yearAry);
      let monthAry = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      firstDateData.push(monthAry);
      this.setData({
        firstDateData: firstDateData,
        monthAry,
        dateRegion: [value[0], month - 1],
      })
    }
    if (month < 10) { month = '0' + month; }
    if (currentDate > 15) {
      monthNums = (currentYear - parseInt(year)) * 12 + (currentMonth + 1 - month + 1);
    } else {
      monthNums = (currentYear - parseInt(year)) * 12 + (currentMonth + 1 - month);
    }
    if ((parseInt(year) + '-' + month) !== this.data.sFirstDate) {
      this.setData({ 
        sCurrentPrice: '', 
        showPriceWarn: false,
        correctCurrentPrice: false,
      });
    }
    this.setData({
      sFirstDate: parseInt(year) + '-' + month,
      correctFirstDate: true,
      monthNums,
    })
    this.enableMatchBtn();
  },

  //当picker组件某一列的值发生改变时触发
  bindcolumnchange(e) {
    let { column, value } = e.detail;
    let currentMonth = new Date().getMonth();
    if (column === 0 && value === 0) { // 第一列中的第一年
      let firstDateData = [];
      firstDateData.push(this.data.yearAry);
      let month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      let monthAry = month.slice(currentMonth);
      firstDateData.push(monthAry);
      this.setData({
        firstDateData: firstDateData,
        monthAry,
        dateRegion: [value, 0],
      })
    } else if (column === 0 && value === 10) { //第一列中的最后一年
      let firstDateData = [];
      firstDateData.push(this.data.yearAry);
      let month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      let monthAry = month.slice(0, currentMonth + 1);
      firstDateData.push(monthAry);
      this.setData({
        firstDateData: firstDateData,
        monthAry,
        dateRegion: [value, 0],
      })
    } else {
      if (column === 0) {
        let firstDateData = [];
        firstDateData.push(this.data.yearAry);
        let monthAry = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        firstDateData.push(monthAry);
        this.setData({
          firstDateData: firstDateData,
          monthAry,
          dateRegion: [value, 0],
        })
      }
    }

    if (column === 1) {
      if (this.data.dateRegion[0] === 0) {
        let firstDateData = [];
        firstDateData.push(this.data.yearAry);
        let month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        let monthAry = month.slice(currentMonth);
        firstDateData.push(monthAry);
        this.setData({
          firstDateData: firstDateData,
          monthAry,
          dateRegion: [0, value],
        })
      } else if (this.data.dateRegion[0] === 10) {
        let firstDateData = [];
        firstDateData.push(this.data.yearAry);
        let month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        let monthAry = month.slice(0, currentMonth + 1);
        firstDateData.push(monthAry);
        this.setData({
          firstDateData: firstDateData,
          monthAry,
          dateRegion: [10, value],
        })
      } else {
        let firstDateData = [];
        firstDateData.push(this.data.yearAry);
        let monthAry = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        firstDateData.push(monthAry);
        this.setData({
          firstDateData: firstDateData,
          monthAry,
          dateRegion: [this.data.dateRegion[0], value],
        })
      }
    }

  },

  //选择车型
  selectModelFn() {
    let vehicle = this.data.vehicle ? this.data.vehicle : {};
    if (vehicle.series_id) {
      let { brand_id, brand_name, sub_brand_id, sub_brand_name, series_id, series_name, year_id, model_year } = vehicle;
      wx.navigateTo({
        url: `/pages/carInfoSelection/carInfoSelection?brand_id=${brand_id}&brand_name=${brand_name}&sub_brand_id=${sub_brand_id}&sub_brand_name=${sub_brand_name}&series_id=${series_id}&series_name=${series_name}`
      })
    } else {
      wx.navigateTo({
        url: '/pages/carBrandSelection/carBrandSelection'
      })
    }
  },


  // 行驶里程输入事件
  distanceInputFn(e) {
    let distance = e.detail.value;
    let regDistance = /^([1-9][0-9]|\d)(\.\d{3,4})$/;
    if (regDistance.test(Number(distance))) {
      let regDistanceTwo = /^(\d+\.\d{2})/;
      let ary = regDistanceTwo.exec(Number(distance));
      distance = ary[0];
    }

    if (e.detail.value > 16) {
      this.setData({
        showDistanceWarn: true,
        sDistance: distance,
      })
    } else {
      this.setData({
        sDistance: distance,
        showDistanceWarn: false,
      })
    }

    if (Number(this.data.sDistance) <= 16 && Number(this.data.sDistance) > 0) {
      this.setData({ correctDistance: true });
    } else {
      this.setData({ correctDistance: false });
    }
    this.enableMatchBtn();
  },

  // 市场现价输入事件
  priceInputFn(e) {
    if (!this.data.sFirstDate) {
      wx.showModal({
        title: '提示',
        content: '请先选择上牌日期',
      })
    } else {
      wx.navigateTo({
        url: '/pages/background/background?pageType=index',
      })
    }

  },

  // 匹配套餐按钮是否可用
  enableMatchBtn() {

    if (this.data.correctProvince && this.data.correctModel && this.data.correctFirstDate && this.data.correctDistance && this.data.correctCurrentPrice) {
      this.setData({ enableMatchBtn: true })
    } else {
      this.setData({ enableMatchBtn: false })
    }
  },

  // 匹配套餐
  matchFn() {
    if (this.data.enableMatchBtn) {
      // 套餐匹配的接口 返回套餐匹配成功或者失败信息 然后展示
      this.setData({
        sDistance: Number(this.data.sDistance),
      })
      let data = {
        province_name: this.data.sLocation,
        car_series_id: this.data.vehicle.series_id,
        register_date: this.data.sFirstDate,
        drive_mileage: Number(this.data.sDistance),
        evaluate_price: this.data.sCurrentPrice
      }
      wx.request({
        // url: host + '/product/match',
        url: host + '/product/match-on-price',
        // url: 'http://192.168.1.113/api/product/match-on-price',
        method: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        success: (res) => {
          if (res.data.success) {
            app.globalData.matchResult = res.data.data;
            wx.navigateTo({
              url: '/pages/match-policy/match-policy',
            })
          }
        },
        fail: (err) => {
          console.log(err);
        }
      })
    }
  },
})