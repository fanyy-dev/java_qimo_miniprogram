const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    showPassword: false,
    loading: false,
    wechatLoading: false
  },

  // 用户名输入
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 切换密码显示状态
  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword });
  },

  // 微信一键登录
  onWechatLogin() {
    this.setData({ wechatLoading: true });
    
    // 模拟微信授权登录
    // 实际项目中需要使用 wx.login 获取 code，然后发送到后端换取 token
    wx.showLoading({ title: '登录中...' });
    
    // 模拟网络请求延迟
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟登录成功，设置用户信息
      const mockUserInfo = {
        id: 10001,
        username: 'wechat_user',
        nickname: '微信用户',
        avatar: '/images/common/default-avatar.png',
        memberLevel: 'SILVER',
        growthValue: 350,
        points: 1200,
        tastePreference: '清淡、偏甜'
      };
      
      // 设置token和用户信息
      const mockToken = 'mock_jwt_token_' + Date.now();
      app.globalData.token = mockToken;
      app.globalData.userInfo = mockUserInfo;
      wx.setStorageSync('token', mockToken);
      wx.setStorageSync('userInfo', mockUserInfo);
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      // 延迟返回上一页或首页
      setTimeout(() => {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          wx.navigateBack();
        } else {
          wx.switchTab({ url: '/pages/index/index' });
        }
      }, 1500);
      
      this.setData({ wechatLoading: false });
    }, 1500);
  },

  // 登录
  onLogin() {
    const { username, password } = this.data;
    
    // 表单验证
    if (username.length === 0) {
      wx.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    
    if (password.length < 6) {
      wx.showToast({ title: '密码不能少于6位', icon: 'none' });
      return;
    }
    
    this.setData({ loading: true });
    
    // 使用封装的登录方法
    app.login(username, password).then(res => {
      wx.showToast({ title: '登录成功', icon: 'success' });
      
      // 延迟返回上一页或首页
      setTimeout(() => {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          wx.navigateBack();
        } else {
          wx.switchTab({ url: '/pages/index/index' });
        }
      }, 1500);
    }).catch(err => {
      console.error('登录失败:', err);
      console.error('请求参数:', { username: username, password });
      // 确保错误信息有意义
      const errorMessage = err.message || '登录失败，请检查用户名和密码';
      wx.showToast({ title: errorMessage, icon: 'none' });
    }).finally(() => {
      this.setData({ loading: false });
    });
  }
});