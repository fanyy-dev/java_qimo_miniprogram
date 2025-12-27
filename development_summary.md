# 餐厅小程序开发过程摘要

## 1. 主要请求和意图

### 初期问题解决
- **图片显示异常**: 解决图片与文字不匹配、占位符图标、渲染错误等问题
- **登录/注册失败**: 修复400错误、"用户不存在"以及"Field 'username' doesn't have a default value"等问题
- **个人中心开发**: 创建个人中心界面，包括用户信息显示、功能菜单、注销、首页入口按钮
- **数据库表创建**: 为个人中心功能在restaurant_db中创建数据库表

### 核心开发任务
- **后端升级**: 将后端升级到Spring Boot 3
- **完整餐厅小程序系统**: 基于详细需求文档实现完整功能

## 2. 关键概念

### 技术栈
- **微信小程序开发**: 页面生命周期、全局数据管理、动态渲染、路由
- **前端工程**: 页面注册、样式模块化、状态管理、模板语法
- **数据库设计**: MySQL表创建、关系模式、约束、跟踪时间戳
- **Spring Boot 3迁移**: 依赖更新、JWT API变更、配置调整
- **JJWT库更新**: 0.9.x、0.11.x和0.12.x版本之间的API变化
- **Spring Boot兼容性**: Spring Boot 3.x与MyBatis Plus 3.5.x之间的兼容性问题
- **JWT认证**: Token生成、Claims提取、密钥管理
- **Maven依赖管理**: 版本冲突、传递依赖、仓库配置
- **MyBatis Plus配置**: MetaObjectHandler自动字段填充、分页插件
- **Redis配置**: 连接工厂设置、缓存管理

### 业务功能
- **用户认证流程**: 微信登录集成、游客模式实现、Token管理
- **会员等级系统**: 成长值跟踪、等级权益展示、会员等级视觉标识
- **消息中心**: 消息分类、已读/未读状态、消息操作
- **积分商城**: 商品分类、积分兑换、库存管理

## 3. 关键文件和代码片段

### 最近开发的功能

#### 消息中心 (pages/messages/list)
**list.wxml**: 
```xml
<view class="message-list">
  <view 
    class="message-item {{item.read ? '' : 'unread'}}" 
    wx:for="{{filteredMessages}}" 
    wx:key="id"
    data-id="{{item.id}}"
    bindtap="onMessageTap"
  >
    <view class="message-icon">
      <view class="icon-wrapper {{item.type}}">
        <view class="icon-text">{{getMessageIcon(item.type)}}</view>
      </view>
    </view>
    <view class="message-content">
      <view class="message-title-row">
        <view class="message-title">{{item.title}}</view>
        <view class="message-time">{{formatTime(item.createTime)}}</view>
      </view>
      <view class="message-desc">{{item.content}}</view>
    </view>
    <view class="message-actions">
      <text class="mark-read" wx:if="{{!item.read}}" bindtap="onMarkRead" data-id="{{item.id}}">标为已读</text>
      <text class="delete" bindtap="onDelete" data-id="{{item.id}}">删除</text>
    </view>
  </view>
</view>
```

**list.js**:
```javascript
// 筛选消息
filterMessages() {
  const { currentTab, allMessages } = this.data;
  
  let filtered = allMessages;
  
  if (currentTab !== 'all') {
    filtered = allMessages.filter(msg => msg.type === currentTab);
  }
  
  // 按时间倒序排列
  filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  this.setData({ filteredMessages: filtered });
},

// 标记为已读
markRead(id) {
  const messages = this.data.allMessages.map(msg => {
    if (msg.id === id) {
      return { ...msg, read: true };
    }
    return msg;
  });
  
  this.setData({ allMessages: messages });
  this.filterMessages();
},
```

#### 积分商城 (pages/points/mall)
**mall.wxml**:
```xml
<view class="goods-list">
  <view 
    class="goods-item" 
    wx:for="{{filteredGoods}}" 
    wx:key="id"
    data-id="{{item.id}}"
    bindtap="onGoodsTap"
  >
    <view class="goods-image">
      <image src="{{item.image}}" mode="aspectFill"></image>
      <view class="goods-tag" wx:if="{{item.isHot}}">热销</view>
    </view>
    <view class="goods-info">
      <view class="goods-name">{{item.name}}</view>
      <view class="goods-desc">{{item.description}}</view>
      <view class="goods-footer">
        <view class="points">
          <view class="points-icon">🏆</view>
          <view class="points-text">{{item.points}}积分</view>
        </view>
        <button 
          class="exchange-btn" 
          size="mini" 
          type="warn"
          disabled="{{userPoints < item.points}}"
          bindtap="onExchange"
          data-id="{{item.id}}"
        >
          {{userPoints < item.points ? '积分不足' : '兑换'}}
        </button>
      </view>
    </view>
  </view>
</view>
```

**mall.js**:
```javascript
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
    
    // 更新商品数据
    const allGoods = this.data.allGoods.map(item => {
      if (item.id === id) {
        return { ...item, stock: item.stock - 1 };
      }
      return item;
    });
    
    this.setData({
      userPoints: userPoints,
      allGoods: allGoods
    });
    
    this.filterGoods();
    
    wx.showToast({
      title: '兑换成功',
      icon: 'success'
    });
  }, 1000);
},
```

#### 首页展示 (pages/index/index.wxml)
```xml
<!-- 附近门店 -->
<view class="section">
  <view class="section-header">
    <text class="section-title">附近门店</text>
    <text class="section-more" bindtap="onMoreStoreTap">更多 ></text>
  </view>
  <view class="store-list">
    <view class="store-item card" wx:for="{{stores}}" wx:key="id" bindtap="onStoreTap" data-id="{{item.id}}">
      <image src="{{item.images[0]}}" class="store-image"></image>
      <view class="store-info">
        <text class="store-name">{{item.storeName}}</text>
        <view class="store-tags">
          <text class="tag tag-primary" wx:for="{{item.tagList}}" wx:key="index" wx:for-item="tag">{{tag}}</text>
        </view>
        <view class="store-meta">
          <text class="store-rating">⭐ {{item.rating}}</text>
          <text class="store-price">人均¥{{item.avgPrice}}</text>
          <text class="store-address">{{item.address}}</text>
        </view>
      </view>
    </view>
  </view>
</view>
```

### 后端关键文件
- **JwtUtil.java**: JWT工具类，处理token生成和验证
- **pom.xml**: Maven配置文件，管理依赖和Spring Boot版本
- **MybatisPlusConfig.java**: MyBatis Plus配置类
- **RedisConfig.java**: Redis配置类

## 4. 错误和修复过程

### 前端问题
1. **图片加载错误**: `[渲染层网络层错误] Failed to load local image resource`
   - **解决方案**: 替换不存在的图片路径为现有资源

2. **MySQL命令语法错误**: `SHOW TABLES LIKE 'user_%' OR SHOW TABLES LIKE '%address%'` 失败
   - **解决方案**: 使用更简单的命令和grep过滤

### 后端Spring Boot 3升级问题
1. **JWT API变更**: JJWT 0.12.x与旧版本API不兼容
   - **解决方案**: 更新JwtUtil.java，切换到新的API调用方式

2. **"Invalid value type for attribute 'factoryBeanObjectType'"错误**: Spring Boot 3.2.0与MyBatis Plus 3.5.x兼容性问题
   - **解决方案**: 降级到Spring Boot 2.7.18，后升级到Spring Boot 3.1.5

3. **JJWT依赖解析问题**: Maven找不到某些版本的JJWT
   - **解决方案**: 移除冗余依赖，保留必要的模块，设置合适的版本

4. **"verifyWith"方法错误**: 找不到符号错误
   - **解决方案**: 显式声明SecretKey变量并在signWith()和verifyWith()方法中使用

5. **MetaObjectHandler冲突**: 重复的Bean定义冲突
   - **解决方案**: 移除MybatisPlusConfig.java中的重复定义

## 5. 解决方案

### 功能实现
- 使用模拟数据和UI实现个人中心功能
- 通过识别缺失图片并更新路径解决图片路径问题
- 为个人中心功能创建必要的数据库表
- 通过以下步骤成功迁移后端到Spring Boot 3:
  - 更新依赖并解决兼容性问题
  - 修复JWT工具类以使用新的JJWT API
  - 解决配置冲突

### 系统开发
- 分析餐厅小程序的详细需求文档
- 为用户中心模块制定实施计划
- 更新个人中心页面支持新功能
- 添加微信快速登录功能
- 实现游客模式浏览
- 创建消息中心
- 开发积分商城功能
- 更新待办事项列表以跟踪进度

## 6. 后续任务

### 餐厅展示模块
- 首页推荐
- 门店列表
- 门店详情
- 菜品浏览
- 搜索功能

### 点餐预订模块
- 在线点餐
- 菜品定制
- 购物车管理
- 预订功能
- 订单确认

### 订单管理模块
- 订单状态跟踪
- 订单操作
- 售后评价

### 营销互动模块
- 促销活动
- 会员权益
- 互动功能

### 管理后台模块
- 数据概览
- 门店管理
- 菜品管理
- 订单管理
- 会员管理
- 营销管理
- 系统管理

## 7. 当前工作状态

目前正在实现餐厅展示模块，包括首页推荐、门店列表、门店详情、菜品浏览和搜索功能。最新任务涉及检查现有首页页面以规划餐厅展示模块的更新。

## 8. 下一步工作

接下来需要增强首页以完全实现餐厅展示模块要求，包括首页推荐、带有详细信息的门店列表、分类菜品浏览和搜索功能。这与用户对餐厅展示模块的明确要求保持一致。