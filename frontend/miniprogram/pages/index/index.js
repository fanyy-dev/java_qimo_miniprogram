// pages/index/index.js
const app = getApp();

Page({
  data: {
    banners: [
      { id: 1, image: 'https://via.placeholder.com/750x300/ff6b6b/ffffff?text=Banner1' },
      { id: 2, image: 'https://via.placeholder.com/750x300/4ecdc4/ffffff?text=Banner2' },
      { id: 3, image: 'https://via.placeholder.com/750x300/ffe66d/ffffff?text=Banner3' }
    ],
    categories: [
      { id: 1, name: '热菜', icon: 'https://via.placeholder.com/100/ff6b6b/ffffff?text=热菜' },
      { id: 2, name: '凉菜', icon: 'https://via.placeholder.com/100/4ecdc4/ffffff?text=凉菜' },
      { id: 3, name: '主食', icon: 'https://via.placeholder.com/100/ffe66d/ffffff?text=主食' },
      { id: 4, name: '酒水', icon: 'https://via.placeholder.com/100/a8e6cf/ffffff?text=酒水' }
    ],
    recommendDishes: [],
    stores: []
  },

  onLoad() {
    this.loadRecommendDishes();
    this.loadStores();
  },

  // 加载推荐菜品
  loadRecommendDishes() {
    app.request({
      url: '/dish/recommend',
      data: { limit: 6 }
    }).then(data => {
      this.setData({ recommendDishes: data });
    }).catch(err => {
      console.error('加载推荐菜品失败', err);
    });
  },

  // 加载门店列表
  loadStores() {
    app.request({
      url: '/store/list',
      data: { pageNum: 1, pageSize: 5 }
    }).then(data => {
      const stores = data.records.map(store => {
        return {
          ...store,
          images: store.images ? JSON.parse(store.images) : [],
          tagList: store.tags ? store.tags.split(',') : []
        };
      });
      this.setData({ stores });
    }).catch(err => {
      console.error('加载门店列表失败', err);
    });
  },

  // 分类点击
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish/list?categoryId=${categoryId}`
    });
  },

  // 菜品点击
  onDishTap(e) {
    const dishId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish/detail?id=${dishId}`
    });
  },

  // 门店点击
  onStoreTap(e) {
    const storeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/store/detail?id=${storeId}`
    });
  },

  // 更多菜品
  onMoreDishTap() {
    wx.navigateTo({
      url: '/pages/dish/list'
    });
  },

  // 更多门店
  onMoreStoreTap() {
    wx.switchTab({
      url: '/pages/store/list'
    });
  }
});
