// app.js
App({
  globalData: {
    baseUrl: 'http://localhost:8080/api',
    token: null,
    userInfo: null
  },

  onLaunch() {
    // 获取本地存储的token和用户信息
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token) {
      this.globalData.token = token;
    }
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  // 网络请求封装
  request(options) {
    const app = this;
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.baseUrl + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'Authorization': app.globalData.token ? 'Bearer ' + app.globalData.token : ''
        },
        success(res) {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else if (res.data.code === 401) {
            // 未登录或登录过期
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            app.globalData.token = null;
            app.globalData.userInfo = null;
            
            wx.showModal({
              title: '提示',
              content: '请先登录',
              success(modalRes) {
                if (modalRes.confirm) {
                  wx.navigateTo({
                    url: '/pages/login/login'
                  });
                }
              }
            });
            reject(res.data.message);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data.message);
          }
        },
        fail(err) {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          reject(err);
        }
      });
    });
  },

  // 登录
  login(username, password) {
    const app = this;
    return app.request({
      url: '/auth/login',
      method: 'POST',
      data: { username, password }
    }).then(data => {
      app.globalData.token = data.token;
      app.globalData.userInfo = data.userInfo;
      wx.setStorageSync('token', data.token);
      wx.setStorageSync('userInfo', data.userInfo);
      return data;
    });
  },

  // 退出登录
  logout() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  }
});
