
Page({
  data: {
    motto: '欢迎来到❤❤❤',
    userInfo: {},
    orderlist:{},
    listLength:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  
  gotoBackOrder: function(e) {
    var arr = wx.getStorageSync('fianlyorderlist') || [];
    var orderlist = wx.getStorageSync('orderlist') || [];
    var payId = e.currentTarget.dataset.id;
    var order = arr[payId];
    orderlist.push(order);
    var orderk = JSON.stringify(orderlist);
    console.log(orderlist)
    wx.setStorageSync('orderlist', orderlist)

    arr.splice(payId, 1);

    this.setData({
      orderlist: arr,
      listLength: arr.length
    })
    console.log(payId)
    console.log(arr)
    wx.setStorageSync('fianlyorderlist', arr)
  },

  onLoad: function () {
    // 获取购物车缓存数据
    var arr = wx.getStorageSync('fianlyorderlist') || [];
    
    this.setData({
      orderlist: arr,
      listLength:arr.length
    })
    console.log(this.data.orderlist);
      
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    // 获取购物车缓存数据
    var arr = wx.getStorageSync('fianlyorderlist') || [];

    this.setData({
      orderlist: arr,
      listLength: arr.length
    })
    console.log(this.data.orderlist);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
})
