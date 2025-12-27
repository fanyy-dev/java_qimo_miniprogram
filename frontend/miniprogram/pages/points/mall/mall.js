const app = getApp();

Page({
  data: {
    currentTab: 'all',
    allGoods: [],
    filteredGoods: [],
    userPoints: 0,
    loading: false
  },

  onShow() {
    this.loadData();
  },

  // 加载数据
  loadData() {
    this.setData({ loading: true });
    
    // 模拟从服务器获取数据
    // 实际项目中需要调用API
    setTimeout(() => {
      // 获取用户积分
      const userPoints = app.globalData.userInfo?.points || 1200;
      
      // 生成模拟商品数据
      const goods = this.generateMockGoods();
      
      this.setData({
        allGoods: goods,
        userPoints: userPoints,
        loading: false
      });
      
      this.filterGoods();
    }, 500);
  },

  // 生成模拟商品数据
  generateMockGoods() {
    const goods = [
      {
        id: 1,
        name: '5元无门槛优惠券',
        description: '全场通用，有效期30天',
        type: 'coupon',
        points: 100,
        image: '/images/common/coupon.png',
        isHot: true
      },
      {
        id: 2,
        name: '10元优惠券',
        description: '满50元可用，有效期30天',
        type: 'coupon',
        points: 200,
        image: '/images/common/coupon.png',
        isHot: false
      },
      {
        id: 3,
        name: '20元优惠券',
        description: '满100元可用，有效期30天',
        type: 'coupon',
        points: 400,
        image: '/images/common/coupon.png',
        isHot: false
      },
      {
        id: 4,
        name: '品牌保温杯',
        description: '保温6小时，容量500ml',
        type: 'gift',
        points: 800,
        image: '/images/common/thermos.png',
        isHot: true
      },
      {
        id: 5,
        name: '精美餐具套装',
        description: '一人份，包含碗、盘、筷',
        type: 'gift',
        points: 500,
        image: '/images/common/tableware.png',
        isHot: false
      },
      {
        id: 6,
        name: '川菜招牌口水鸡',
        description: '精选鸡腿肉，秘制调料',
        type: 'meal',
        points: 300,
        image: '/images/dishes/chuanweiguan.jpg',
        isHot: true
      },
      {
        id: 7,
        name: '招牌酸菜鱼',
        description: '鲜嫩鱼肉，酸辣开胃',
        type: 'meal',
        points: 400,
        image: '/images/dishes/suancaiyu.jpg',
        isHot: false
      },
      {
        id: 8,
        name: '家常小炒组合',
        description: '3菜1汤，家常味道',
        type: 'meal',
        points: 600,
        image: '/images/dishes/jiachangxiaochao.jpg',
        isHot: false
      }
    ];
    
    return goods;
  },

  // 筛选商品
  filterGoods() {
    const { currentTab, allGoods } = this.data;
    
    let filtered = allGoods;
    
    if (currentTab !== 'all') {
      filtered = allGoods.filter(goods => goods.type === currentTab);
    }
    
    this.setData({ filteredGoods: filtered });
  },

  // 切换标签页
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.filterGoods();
  },

  // 点击商品
  onGoodsTap(e) {
    const id = e.currentTarget.dataset.id;
    const goods = this.data.allGoods.find(item => item.id === id);
    
    if (!goods) return;
    
    // 显示商品详情
    wx.showModal({
      title: goods.name,
      content: `${goods.description}\n\n所需积分: ${goods.points}`,
      confirmText: '兑换',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.exchangeGoods(id);
        }
      }
    });
  },

  // 点击兑换按钮
  onExchange(e) {
    e.stopPropagation(); // 阻止事件冒泡
    
    const id = e.currentTarget.dataset.id;
    const goods = this.data.allGoods.find(item => item.id === id);
    
    if (!goods) return;
    
    // 检查积分是否足够
    if (this.data.userPoints < goods.points) {
      wx.showToast({
        title: '积分不足',
        icon: 'none'
      });
      return;
    }
    
    // 确认兑换
    wx.showModal({
      title: '确认兑换',
      content: `确定要兑换"${goods.name}"吗？\n需要${goods.points}积分`,
      success: (res) => {
        if (res.confirm) {
          this.exchangeGoods(id);
        }
      }
    });
  },

  // 兑换商品
  exchangeGoods(id) {
    const goods = this.data.allGoods.find(item => item.id === id);
    
    if (!goods) return;
    
    // 检查积分是否足够
    if (this.data.userPoints < goods.points) {
      wx.showToast({
        title: '积分不足',
        icon: 'none'
      });
      return;
    }
    
    // 模拟兑换成功
    wx.showLoading({ title: '兑换中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 更新用户积分
      const userPoints = this.data.userPoints - goods.points;
      
      // 更新商品数据（这里简化处理，实际应该更新服务器数据）
      const allGoods = this.data.allGoods.map(item => {
        if (item.id === id) {
          // 这里简化处理，实际应该处理库存等逻辑
          return item;
        }
        return item;
      });
      
      // 更新用户信息中的积分
      if (app.globalData.userInfo) {
        app.globalData.userInfo.points = userPoints;
        wx.setStorageSync('userInfo', app.globalData.userInfo);
      }
      
      this.setData({
        userPoints: userPoints,
        allGoods: allGoods
      });
      
      this.filterGoods();
      
      wx.showToast({
        title: '兑换成功',
        icon: 'success'
      });
      
      // 如果是优惠券，跳转到优惠券列表
      if (goods.type === 'coupon') {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/coupons/list/list'
          });
        }, 1500);
      }
    }, 1000);
  }
});