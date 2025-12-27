const app = getApp();

Page({
  data: {
    isLoggedIn: false,
    orderItems: [],
    selectedAddress: null,
    payMethod: 'wechat',
    remark: '',
    selectedCoupon: null,
    subtotalPrice: 0,
    deliveryFee: 5,
    discountAmount: 0,
    finalPrice: 0,
    orderSource: 'cart' // cart 或 immediate
  },

  onLoad(options) {
    this.checkLoginStatus();
    this.loadOrderData(options);
  },

  onShow() {
    // 从地址选择页面返回时刷新地址信息
    const selectedAddress = wx.getStorageSync('selectedAddress');
    if (selectedAddress) {
      this.setData({ selectedAddress });
      wx.removeStorageSync('selectedAddress');
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = app.globalData.token;
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    
    this.setData({ 
      isLoggedIn: !!token && !!userInfo.id
    });
  },

  // 加载订单数据
  loadOrderData(options) {
    let orderData = wx.getStorageSync('pendingOrder');
    
    if (!orderData) {
      wx.showToast({ title: '订单数据异常', icon: 'error' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    // 处理订单数据
    const items = orderData.items || orderData.dishes || [];
    const subtotalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    this.setData({
      orderItems: items,
      orderSource: orderData.source || 'immediate',
      subtotalPrice: subtotalPrice.toFixed(2),
      finalPrice: (subtotalPrice + this.data.deliveryFee).toFixed(2)
    });

    // 加载默认地址
    this.loadDefaultAddress();
  },

  // 加载默认地址
  loadDefaultAddress() {
    const addresses = wx.getStorageSync('userAddresses') || [];
    const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0] || null;
    
    if (defaultAddress) {
      // 处理完整地址
      const fullAddress = `${defaultAddress.province || ''}${defaultAddress.city || ''}${defaultAddress.district || ''}${defaultAddress.detail || ''}`;
      this.setData({
        selectedAddress: {
          ...defaultAddress,
          fullAddress: fullAddress.trim() || defaultAddress.detail || '暂无地址信息'
        }
      });
    }
  },

  // 选择地址
  selectAddress() {
    wx.navigateTo({
      url: '/pages/address/list/list?selectMode=true'
    });
  },

  // 添加地址
  addAddress() {
    wx.navigateTo({
      url: '/pages/address/edit/edit?mode=add'
    });
  },

  // 选择支付方式
  selectPayMethod(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ payMethod: method });
  },

  // 备注输入
  onRemarkChange(e) {
    this.setData({ remark: e.detail.value });
  },

  // 选择优惠券
  selectCoupon() {
    // 这里应该跳转到优惠券选择页面
    wx.showModal({
      title: '提示',
      content: '优惠券功能正在开发中',
      showCancel: false
    });
  },

  // 提交订单
  submitOrder() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            this.goToLogin();
          }
        }
      });
      return;
    }

    if (!this.data.selectedAddress) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }

    if (this.data.orderItems.length === 0) {
      wx.showToast({ title: '订单商品为空', icon: 'none' });
      return;
    }

    // 创建订单
    this.createOrder();
  },

  // 创建订单
  createOrder() {
    const orderData = {
      id: Date.now(),
      orderNo: 'ORD' + Date.now(),
      items: this.data.orderItems,
      address: this.data.selectedAddress,
      payMethod: this.data.payMethod,
      remark: this.data.remark,
      subtotalPrice: parseFloat(this.data.subtotalPrice),
      deliveryFee: this.data.deliveryFee,
      discountAmount: this.data.discountAmount,
      finalPrice: parseFloat(this.data.finalPrice),
      status: 1, // 待付款
      createTime: new Date().toLocaleString(),
      source: this.data.orderSource
    };

    wx.showLoading({ title: '提交中...' });

    // 模拟提交订单
    setTimeout(() => {
      wx.hideLoading();
      
      // 保存订单到本地
      const orders = wx.getStorageSync('userOrders') || [];
      orders.unshift(orderData);
      wx.setStorageSync('userOrders', orders);

      // 如果是从购物车来的，清空已购买的商品
      if (this.data.orderSource === 'cart') {
        this.removePurchasedItemsFromCart();
      }

      // 清除待处理订单数据
      wx.removeStorageSync('pendingOrder');

      // 跳转到支付页面或订单详情
      wx.showModal({
        title: '订单提交成功',
        content: `订单号：${orderData.orderNo}\n金额：¥${this.data.finalPrice}`,
        showCancel: false,
        success: () => {
          wx.navigateTo({
            url: '/pages/orders/list/list'
          });
        }
      });
    }, 1500);
  },

  // 从购物车移除已购买的商品
  removePurchasedItemsFromCart() {
    const cart = wx.getStorageSync('cart') || [];
    const purchasedIds = this.data.orderItems.map(item => item.id);
    
    const updatedCart = cart.filter(item => !purchasedIds.includes(item.id));
    wx.setStorageSync('cart', updatedCart);
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});