const app = getApp();

Page({
  data: {
    order: null,
    orderId: '',
    loading: true
  },

  onLoad(options) {
    // 获取订单ID
    this.setData({ orderId: options.id });
    // 加载订单详情
    this.loadOrderDetail();
  },

  // 加载订单详情
  loadOrderDetail() {
    this.setData({ loading: true });
    
    // 模拟订单详情数据
    const mockOrderDetail = {
      id: 1,
      orderNo: 'ORD202512240001',
      totalPrice: 128.5,
      status: 1, // 待付款
      createTime: '2025-12-24 10:30:25',
      payTime: null,
      deliveryTime: null,
      completeTime: null,
      address: {
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '建国路88号现代城A座1001室'
      },
      orderItems: [
        { dishName: '宫保鸡丁', price: 38, quantity: 1, image: '/images/dishes/gongbaojiding.jpg' },
        { dishName: '夫妻肺片', price: 28, quantity: 1, image: '/images/dishes/fuqifeipian.jpg' },
        { dishName: '米饭', price: 3, quantity: 2, image: '/images/dishes/mifan.jpg' }
      ]
    };
    
    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({
        order: mockOrderDetail,
        loading: false
      });
    }, 500);
  },

  // 支付订单
  onPayOrder() {
    wx.showToast({
      title: '支付功能开发中',
      icon: 'none'
    });
  },

  // 取消订单
  onCancelOrder() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 模拟取消订单
          this.setData({
            'order.status': 4
          });
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
        }
      }
    });
  },

  // 确认收货
  onConfirmReceipt() {
    wx.showModal({
      title: '确认收货',
      content: '请确认您已收到商品',
      success: (res) => {
        if (res.confirm) {
          // 模拟确认收货
          this.setData({
            'order.status': 3
          });
          wx.showToast({
            title: '收货成功',
            icon: 'success'
          });
        }
      }
    });
  }
});
