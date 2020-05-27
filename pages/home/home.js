//logs.js
var util = require('../../utils/util.js')
var sliderWidth = 190// 需要设置slider的宽度，用于计算中间位置
// 最大行数
var max_row_height = 5;
// 行高
var food_row_height = 50;
// 底部栏偏移量
var cart_offset = 90;


Page({
  data: {
    logs: [],
    tabs: ["今日菜单", "我的订单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 0.5,
    //状态清单
    statuList:new Map,
    // 右菜单
    menu_list: [],
    // 左菜单
    foodList: [],//展示菜品
    allFoodList: [],//所有获取到的菜品
    //我的订单列表
    orderList: [],
    // 购物车
    cartList: [],
    hasList: false,// 列表是否有数据
    totalPrice: 0,// 总价，初始为0
    totalNum: 0,  //总数，初始为0
    // 购物车动画
    animationData: {},
    animationMask: {},
    maskVisual: "hidden",
    maskFlag: true,
    // 左右两侧菜单的初始显示次序
    curNav: 0,

    //判断是否登录会员
    loginFlag: true,
    //判断是否已经发送验证码
    sendingF: false,
    // 倒计时时间
    second: 60,

  },
  onLoad: function (options) {
    var that = this
    // 获取购物车缓存数据
    var arr = wx.getStorageSync('cart') || [];
    // 左分类菜单
    var menu_list = this.data.menu_list;
    // 获取左侧分类菜单数据
    var categories = [
      {
        "id": 0,
        "name": "全部"
      },
      /*{
        "id": 9,
        "name": "活动品"
      },*/
      {
        "id": 1,
        "name": "❤奖励卷"
      },
      {
        "id": 2,
        "name": "❤100件"
      }/*,
      {
        "id": 5,
        "name": "面点"
      },
      {
        "id": 6,
        "name": "特色"
      },
      {
        "id": 7,
        "name": "小吃"
      },
      {
        "id": 8,
        "name": "水吧"
      }*/
    ]
    that.setData({
      menu_list: categories,
    })
    // 右菜品菜单
    var foodList = this.data.foodList;
    var allFoodList = this.data.allFoodList;
    // 购物车总量、总价
    var totalPrice = this.data.totalPrice
    var totalNum = this.data.totalNum
    // 获取右侧菜品列表数据
    var resFood = [
      {
        "id": 1,
        "name": "免早睡卷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤免早睡一次", //簡介
        "quantity": 0
      },
      {
        "id": 2,
        "name": "跑腿卷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤无条件跑腿一次", //簡介
        "quantity": 0
      },
      {
        "id": 3,
        "name": "耍赖卷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤无条件耍赖一次", //簡介
        "quantity": 0
      },
      {
        "id": 4,
        "name": "捶背按摩卷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤按摩捶背一次", //簡介
        "quantity": 0
      },
      {
        "id": 5,
        "name": "洗碗做饭卷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤洗碗做饭一次", //簡介
        "quantity": 0
      },
      {
        "id": 6,
        "name": "免生气卷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤停止生气一次", //簡介
        "quantity": 0
      },
      {
        "id": 7,
        "name": "亲亲抱抱卷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤无视任何东西亲亲抱抱一次", //簡介
        "quantity": 0
      },
      {
        "id": 8,
        "name": "亲亲抱抱举高高大礼包卷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤兑换大礼包一份", //簡介
        "quantity": 0
      },
      {
        "id": 9,
        "name": "卸妆券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤帮忙卸妆一次", //簡介
        "quantity": 0
      },
      {
        "id": 10,
        "name": "为所欲为券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤可以随心所欲做一件事", //簡介
        "quantity": 0
      },
      {
        "id": 11,
        "name": "逗我开心券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤无条件逗开心一次", //簡介
        "quantity": 0
      },
      {
        "id": 12,
        "name": "零食券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤可以选择购买任何零食一次", //簡介
        "quantity": 0
      },
      {
        "id": 13,
        "name": "清空购物车券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤帮忙清空购物车一次", //簡介
        "quantity": 0
      },
      {
        "id": 14,
        "name": "暖被窝券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤让杰杰暖被窝一次", //簡介
        "quantity": 0
      },
      {
        "id": 15,
        "name": "夜宵券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤购买或煮夜宵一次", //簡介
        "quantity": 0
      },
      {
        "id": 16,
        "name": "游乐园券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤去游乐园一次", //簡介
        "quantity": 0
      },
      {
        "id": 17,
        "name": "停止冷战券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤停止冷战一次", //簡介
        "quantity": 0
      },
      {
        "id": 18,
        "name": "修眉券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤杰杰帮忙修眉一次", //簡介
        "quantity": 0
      },
      {
        "id": 19,
        "name": "随叫随到券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤随叫随到一次", //簡介
        "quantity": 0
      },
      {
        "id": 20,
        "name": "陪伴券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤无条件到你身边一次", //簡介
        "quantity": 0
      },
      {
        "id": 21,
        "name": "公主抱券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤公主抱一次", //簡介
        "quantity": 0
      },
      {
        "id": 22,
        "name": "反悔券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤反悔一次", //簡介
        "quantity": 0
      },
      {
        "id": 23,
        "name": "家务券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤杰杰做家务一次", //簡介
        "quantity": 0
      },
      {
        "id": 24,
        "name": "哄我券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤杰杰哄到开心一次", //簡介
        "quantity": 0
      },
      {
        "id": 25,
        "name": "和好券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤和好一次", //簡介
        "quantity": 0
      },
      {
        "id": 26,
        "name": "抱抱券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤抱抱一次", //簡介
        "quantity": 0
      },
      {
        "id": 27,
        "name": "亲亲券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤亲亲一次", //簡介
        "quantity": 0
      },
      {
        "id": 28,
        "name": "啪啪券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤o(*////▽////*)q羞羞一次", //簡介
        "quantity": 0
      },
      {
        "id": 29,
        "name": "自定义券",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 1,
        "sales": 0,
        "note": "❤出示此卷可令❤在备注自定义一件事", //簡介
        "quantity": 0
      },

      {
        "id": 101,
        "name": "1.一起去电影院看一场电影🎬",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0,
      },
      {
        "id": 102,
        "name": "2.一起穿情侣装逛街👫",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 103,
        "name": "3.一起去一趟迪士尼游乐园🎠",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 104,
        "name": "4.一起去游泳🏊",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 105,
        "name": "5.一起唱次歌并且录下来🎤",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 106,
        "name": "6.一起在厨房做次饭🍚",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 107,
        "name": "7.一起过次烛光晚餐🕯",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 108,
        "name": "8.一起过生日🎂",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 109,
        "name": "9.一起打扫卫生🚰",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 110,
        "name": "10.一起给对方写信 然后读给对方听💌",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 111,
        "name": "11.一起去一次鬼屋👻",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 112,
        "name": "12.一起去蹦极🌉",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 113,
        "name": "13.一起养宠物🐱",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 114,
        "name": "14.一起研究口红色号💄",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 115,
        "name": "15.一起给对方化妆💋",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 116,
        "name": "16.一起为对方抹指甲油💅",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 117,
        "name": "17.一起去做次陶艺🍶",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 118,
        "name": "18.一起锻炼身体🚴",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 119,
        "name": "19.一起去吃一次全家桶🍟",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 120,
        "name": "20.一起熬夜通宵跨年💑",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 121,
        "name": "21.一起去旅游🚊",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 122,
        "name": "22.一起去爬山⛰",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 123,
        "name": "23.一起坐一次摩天轮🎡",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 124,
        "name": "24.一起拍视频记录生活📹",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 125,
        "name": "25.一起为对方刷牙 对着镜子搞怪 然后😘",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 126,
        "name": "26.一起去看一次海 去沙滩🏖",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 127,
        "name": "27.互穿对方的衣服 拍照留念📷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 128,
        "name": "28.一起逛超市买好吃的🛒",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 129,
        "name": "29.一起坐一次热气球",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 130,
        "name": "30.一起看书 分享自己喜欢的书籍📚",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 131,
        "name": "31.一起在下雨天追剧☔",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 132,
        "name": "32.一起做一次蛋糕甜点🍰",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 133,
        "name": "33.一起看日出看日落🌄",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 134,
        "name": "34.一起上下班 坐地铁🚇",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 135,
        "name": "35.一起画画🎨",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 136,
        "name": "36.一起弹吉他🎸",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 137,
        "name": "37.一起去滑雪🏂",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 138,
        "name": "38.一起玩一次游戏机🎮",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 139,
        "name": "39.一起坐一次飞机✈",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 140,
        "name": "40.一起种花草🌹",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 141,
        "name": "41.一起用情侣手机壳📱",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 142,
        "name": "42.一起去一次海底世界🐟",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 143,
        "name": "43.一起喝醉一次🍺",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 144,
        "name": "44.一起打扑克牌♣",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 145,
        "name": "45.一起去天安门看升国旗🇨",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 146,
        "name": "46.一起修理电器🛠",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 147,
        "name": "47.一起看星星 烟花🎆",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 148,
        "name": "48.一起吃火锅🍲",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 149,
        "name": "49.一起庆祝恋爱纪念日💏",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 150,
        "name": "50.一起去一次教堂⛪",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 151,
        "name": "51.一起看雪 堆雪人☃",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 152,
        "name": "52.一起换发型，剪头发💇",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 153,
        "name": "53.一起和朋友们去吃饭👬",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 154,
        "name": "54.一起跳舞💃",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 155,
        "name": "55.一起听音乐 听同一首歌🎧",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 156,
        "name": "56.一起坐一次船🚢",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 157,
        "name": "57.一起露营 住一次帐篷🏕",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 158,
        "name": "58.一起为对方准备DIY手工礼物✂",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 159,
        "name": "59.拍个合照吧📷",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 160,
        "name": "60.互相为对方洗头 吹头发🚿",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 161,
        "name": "61.一起去看演唱会💙",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 162,
        "name": "62.一起放个孔明灯🏮",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 163,
        "name": "63.一起去果园摘水果🍓",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 164,
        "name": "64.一起玩秋千嘻嘻🌥",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 165,
        "name": "65.我帮你剃胡子 你帮我画眉😯",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 166,
        "name": "66.背我走一段路？🏋🏻‍♂",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 167,
        "name": "67.让你选择一道你喜欢的菜 我去学👩",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 168,
        "name": "68.夏天用勺子吃西瓜 最甜的那块要给我🍉",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 169,
        "name": "69.雨天接对方下班☔",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 170,
        "name": "70.至少为对方改掉一个坏毛病🙅🏻‍♀",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 171,
        "name": "71.冬天怕冷 要当我的暖手宝😾",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 172,
        "name": "72.吃完饭要一起洗碗🥘",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 173,
        "name": "73.在外人面前就是要先偏帮自己人💥",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 174,
        "name": "74.去一趟日本 看看富士山 穿和服拍拍照片🎎",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 175,
        "name": "75.一起放风筝🌪",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 176,
        "name": "76.带对戒嘻嘻💍",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 177,
        "name": "77.一起放花灯🌺",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 178,
        "name": "78.一起去寺庙祈福🌠",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 179,
        "name": "79.去一次“天涯海角”🏖",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 180,
        "name": "80.讲故事哄对方入睡📖",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 181,
        "name": "81.一起去DIY蛋糕🍰",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 182,
        "name": "82.拍一次情侣写真👰",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 183,
        "name": "83.为对方织一件东西🧶",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 184,
        "name": "84.在朋友面前介绍对方👫",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 185,
        "name": "85.一起坐一辆从没做过的车，在不认识的地方下车到处逛🚎",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 186,
        "name": "86.一起去攀岩🧗‍♀",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 187,
        "name": "87.比赛吃西瓜🍉",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 188,
        "name": "88.一起去漂流🏄‍♀",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 189,
        "name": "89.一起去划船🚣‍♀",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 190,
        "name": "90.在冬天共用一副手套🧤",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 191,
        "name": "91.一起守岁 给对方守岁红包🧨",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 192,
        "name": "92.一起贴对联🧧",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 193,
        "name": "93.比赛吹泡泡🔫",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 194,
        "name": "94.一起包饺子🥟",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 195,
        "name": "95.牵手压马路👫",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 196,
        "name": "96.一起通宵跨年💸",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 197,
        "name": "97.为对方做早餐🥣",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 198,
        "name": "98.陪我赖床🛏",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 199,
        "name": "99.一起窝在沙发上看电视🍧",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 200,
        "name": "100.一起白头偕老吧👰",
        "thumb": "",
        "price": "0",
        "unit": "件",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      }

    ]

    this.initStatu();

    // 进入页面后判断购物车是否有数据，如果有，将菜单与购物车quantity数据统一
    if (arr.length > 0) {
      for (var i in arr) {
        for (var j in resFood) {
          if (resFood[j].id == arr[i].id) {
            resFood[j].quantity = arr[i].quantity;
          }
        }
      }
    }
    // that.setData({
    //   foodList: resFood,
    //   allFoodList: resFood,
    // })
    // 进入页面计算购物车总价、总数
    if (arr.length > 0) {
      for (var i in arr) {
        totalPrice += arr[i].price * arr[i].quantity;
        totalNum += Number(arr[i].quantity);
      }
    }
    // 赋值数据
    this.setData({
      hasList: true,
      cartList: arr,
      foodList: resFood,
      allFoodList: resFood,
//      payFlag: this.data.payFlag,
      totalPrice: totalPrice.toFixed(2),
      totalNum: totalNum
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - res.windowWidth / 2) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });
  },
  // 点击切换tab
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 点击切换右侧数据
  changeRightMenu: function (e) {
    var classify = e.target.dataset.id;// 获取点击项的id
    var foodList = this.data.foodList;
    var allFoodList = this.data.allFoodList;
    var newFoodList = [];
    if (classify == 0) {//选择了全部选项
      this.setData({
        curNav: classify,
        foodList: allFoodList
      })
    } else { //选择了其他选项
      for (var i in allFoodList) {
        if (allFoodList[i].catid == classify) {
          newFoodList.push(allFoodList[i])
        }
      }
      this.setData({
        // 右侧菜单当前显示第curNav项
        curNav: classify,
        foodList: newFoodList
      })
    }
  },
  // 购物车增加数量
  addCount: function (e) {
    this.initStatu();
    var id = e.currentTarget.dataset.id;
    var arr = wx.getStorageSync('cart') || [];
    var f = false;
    for (var i in this.data.foodList) {// 遍历菜单找到被点击的菜品，数量加1
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity += 1;
        if (arr.length > 0) {
          for (var j in arr) {// 遍历购物车找到被点击的菜品，数量加1
            if (arr[j].id == id) {
              arr[j].quantity += 1;
              f = true;
              try {
                wx.setStorageSync('cart', arr)
              } catch (e) {
                console.log(e)
              }
              break;
            }
          }
          if (!f) {
            arr.push(this.data.foodList[i]);
          }
        } else {
          arr.push(this.data.foodList[i]);
        }
        try {
          wx.setStorageSync('cart', arr)
        } catch (e) {
          console.log(e)
        }
        break;
      }
    }

    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice();
  },
  // 定义根据id删除数组的方法
  removeByValue: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == val) {
        array.splice(i, 1);
        break;
      }
    }
  },

  initStatu: function () {
    var arr1 = wx.getStorageSync('orderlist') || [];
    var arr2 = wx.getStorageSync('fianlyorderlist') || [];
    var order = new Map(); 
    for (var i = 0; i < arr1.length; i++) {
      for (var j = 0; j < arr1[i].catlist.length; j++){
        if (arr1[i].catlist[j].catid == '2'){
          order[arr1[i].catlist[j].id] = 1;
        //  console.log(order);
        }
      }
    }
    for (var i = 0; i < arr2.length; i++) {
      for (var j = 0; j < arr2[i].catlist.length; j++) {
        if (arr2[i].catlist[j].catid == '2') {
          order[arr2[i].catlist[j].id] = 2;
          //console.log(order);
        }
      }
    }
    console.log(order);
    this.setData({
      statuList: order,
    })
  },
  // 购物车减少数量
  minusCount: function (e) {
    var id = e.currentTarget.dataset.id;
    var arr = wx.getStorageSync('cart') || [];
    for (var i in this.data.foodList) {
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity -= 1;
        if (this.data.foodList[i].quantity <= 0) {
          this.data.foodList[i].quantity = 0;
        }
        if (arr.length > 0) {
          for (var j in arr) {
            if (arr[j].id == id) {
              arr[j].quantity -= 1;
              if (arr[j].quantity <= 0) {
                this.removeByValue(arr, id)
              }
              if (arr.length <= 0) {
                this.setData({
                  foodList: this.data.foodList,
                  cartList: [],
                  totalNum: 0,
                  totalPrice: 0,
                })
                this.cascadeDismiss()
              }
              try {
                wx.setStorageSync('cart', arr)
              } catch (e) {
                console.log(e)
              }
            }
          }
        }
      }
    }
    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice();
  },
  // 获取购物车总价、总数
  getTotalPrice: function () {
    var cartList = this.data.cartList;                  // 获取购物车列表
    var totalP = 0;
    var totalN = 0
    for (var i in cartList) {                           // 循环列表得到每个数据
      totalP += cartList[i].quantity * cartList[i].price;    // 所有价格加起来     
      totalN += cartList[i].quantity
    }
    this.setData({                                      // 最后赋值到data中渲染到页面
      cartList: cartList,
      totalNum: totalN,
      totalPrice: totalP.toFixed(2)
    });
  },
  // 清空购物车
  cleanList: function (e) {
    for (var i in this.data.foodList) {
      this.data.foodList[i].quantity = 0;
    }
    try {
      wx.setStorageSync('cart', "")
    } catch (e) {
      console.log(e)
    }
    this.setData({
      foodList: this.data.foodList,
      cartList: [],
      cartFlag: false,
      totalNum: 0,
      totalPrice: 0,
    })
    this.cascadeDismiss()
  },

  //删除购物车单项
  deleteOne: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var arr = wx.getStorageSync('cart')
    for (var i in this.data.foodList) {
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity = 0;
      }
    }
    arr.splice(index, 1);
    if (arr.length <= 0) {
      this.setData({
        foodList: this.data.foodList,
        cartList: [],
        cartFlag: false,
        totalNum: 0,
        totalPrice: 0,
      })
      this.cascadeDismiss()
    }
    try {
      wx.setStorageSync('cart', arr)
    } catch (e) {
      console.log(e)
    }


    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice()
  },
  //切换购物车开与关
  cascadeToggle: function () {
    var that = this;
    var arr = this.data.cartList
    if (arr.length > 0) {
      if (that.data.maskVisual == "hidden") {
        that.cascadePopup()
      } else {
        that.cascadeDismiss()
      }
    } else {
      that.cascadeDismiss()
    }

  },
  // 打开购物车方法
  cascadePopup: function () {
    var that = this;
    // 购物车打开动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(0.8).step();
    that.setData({
      animationMask: that.animationMask.export(),
      maskVisual: "show",
      maskFlag: false,
    });
  },
  // 关闭购物车方法
  cascadeDismiss: function () {
    var that = this
    // 购物车关闭动画
    that.animation.translate(0,285).step();
    that.setData({
      animationData: that.animation.export()
    });
    // 遮罩渐变动画
    that.animationMask.opacity(0).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
    // 隐藏遮罩层
    that.setData({
      maskVisual: "hidden",
      maskFlag: true
    });
  },
  // 跳转确认订单页面
  gotoOrder: function () {
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder'
    })
  },

  // 判断是否获取到会员信息
  // ifLogin: function () {
  //   // 获取登录状态码
  //   var loginCode = wx.getStorageSync('loginCode') || [];
  //   console.log(loginCode)
  //   var loginFlag = this.data.loginFlag;
  //   if (loginCode == 300) {
  //     loginFlag = false;
  //     this.setData({
  //       loginFlag: loginFlag
  //     })
  //   } else {
  //     loginFlag = true;
  //     this.setData({
  //       loginFlag: loginFlag
  //     })
  //   }

  // },
  // // 获取备填写的手机号码
  // getMobile: function (e) {
  //   var mobile = this.data.mobile;
  //   this.setData({
  //     mobile: e.detail.value
  //   })
  // },
  // //获取填入的验证码
  // getSmscode: function (e) {
  //   var smscode = this.data.smscode;
  //   this.setData({
  //     smscode: e.detail.value
  //   })
  // },
  // // 获取验证码倒计时
  // beginTimer: function () {
  //   var mobile = this.data.mobile
  //   if (mobile == '') {
  //     wx.showToast({
  //       title: '号码不能为空',
  //       duration: 2000
  //     })
  //   } else {
  //     wx.request({
  //       url: 'https://api.meidi.test.sszshow.com/wechatmeal/home/setmsg',
  //       method: "POST",
  //       data: {
  //         mobile: mobile
  //       },
  //       success: function (res) {
  //         console.log(res.data.code)
  //         if (res.data.code == 400) {
  //           that.setData({
  //             loginFlag: true,
  //           })
  //           wx.showModal({
  //             title: '提示',
  //             content: '您暂时不是我们的会员，请去前台或微信公众号办理',
  //             showCancel: false,
  //             success: function (res) {
  //               if (res.confirm) {
  //                 console.log('用户点击确定')
  //               } else if (res.cancel) {
  //                 console.log('用户点击取消')
  //               }
  //             }
  //           })
  //         } else {
  //           that.setData({
  //             loginFlag: false,
  //           })
  //         }
  //       }
  //     })
  //     this.setData({
  //       sendingF: true
  //     })
  //     var that = this
  //     var verifyTimer = setInterval(function () {
  //       var second = that.data.second - 1
  //       that.setData({
  //         second: second
  //       })
  //       if (second < 1) {
  //         clearInterval(verifyTimer)
  //         that.setData({
  //           second: 60,
  //           sendingF: false
  //         })
  //       }
  //     }, 1000)
  //   }

  // },
  // // 提交手机验证码
  // goSubmit: function (e) {
  //   var that = this;
  //   var loginFlag = this.data.loginFlag;
  //   var mobile = this.data.mobile;
  //   var smscode = this.data.smscode;
  //   var rd_session = wx.getStorageSync('rd_session') || [];
  //   var shop_id = wx.getStorageSync('shop_id') || [];
  //   var desk_id = wx.getStorageSync('desk_id') || [];
  //   // console.log(mobile)
  //   // console.log(smscode)
  //   // console.log(rd_session)
    
  //   wx.request({
  //     url: 'https://api.meidi.test.sszshow.com/wechatmeal/home/get_member',
  //     method: 'POST',
  //     data: {
  //       shop_id: shop_id,
  //       desk_id: desk_id,
  //       mobile: mobile,
  //       smscode: smscode,
  //       rd_session: rd_session
  //     },
  //     success: function (res) {
  //       that.setData({
  //         loginFlag: true,
  //       })
  //       if (res.data.code == 200) {
  //         try {
  //           wx.setStorageSync('loginCode', 200)
  //         } catch (e) { }
  //         wx.showToast({
  //           title: '登录成功',
  //           duration: 2000
  //         })

  //       } else {
  //         console.log("denglushibai")
  //       }
  //     }
  //   })
  // },
  GetQueryString:function (name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }
  


})
