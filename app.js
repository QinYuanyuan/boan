App({
  onLaunch: function () {},
  // getUserInfo: function(cb){
  //   var self = this;
  //   if(self.globalData.userInfo){
  //     typeof cb == 'function' && cb(this.globalData.userInfo)
  //   }else{
  //     wx.login({
  //       success: function(res){
  //         wx.getUserInfo({
  //           success: function(){
  //             self.globalData.userInfo = res.userInfo;
  //             typeof cb == 'function' && cb(this.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  globalData: {
    // userInfo: null,

    matchResult: {},//匹配结果
    modelInfo: [],//vin识别车型的结果
    // vin: 'LFP84ACC5E1A55812',//用户输入的vin
    // allModelLists: [
    //   {
    //     aspirated_way: "自然吸气",
    //     brand_name: "别克",
    //     chassis_num: "SGM E11",
    //     displacement:"2.4",
    //     drive_system:"前轮驱动",
    //     engine_model:"LE5",
    //     family_name:"君越",
    //     front_tyre_spec:"225/55 R17",
    //     fuel_type:"汽油",
    //     gearbox_type:"自动",
    //     gears_num:"6",
    //     hub_material:"铝合金",
    //     manu_name:"上海通用",
    //     rear_tyre_spec:"225/55 R17",
    //     sales_desig:"2.4 手自一体 舒适版",
    //     sales_version:"舒适版",
    //     structure:"三厢",
    //     trans_desc:"手自一体变速器(AMT)",
    //     vehicle_name:"君越",
    //     year_pattern:"2010",
    //     current_price: "100",
    //   },
    //   {
    //     aspirated_way: "自然吸气",
    //     brand_name:"别克",
    //     chassis_num:"SGM E11",
    //     displacement:"2.4",
    //     drive_system: "前轮驱动",
    //     engine_model:"LE5",
    //     family_name:"君越",
    //     front_tyre_spec:"225/55 R17",
    //     fuel_type:"汽油",
    //     gearbox_type:"自动",
    //     gears_num:"6",
    //     hub_material:"铝合金",
    //     manu_name:"上海通用",
    //     rear_tyre_spec:"225/55 R17",
    //     sales_desig:"2.4 手自一体 雅致版",
    //     sales_version:"雅致版",
    //     structure:"三厢",
    //     trans_desc:"手自一体变速器(AMT)",
    //     vehicle_name:"君越",
    //     year_pattern:"2010",
    //     current_price: "20",
    //   }
    // ],//识别出来的全部车型
    vin: '',
    allModelLists: [],
  }
})