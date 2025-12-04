# 饭店小程序系统 - 快速开始指南

## 🎉 项目介绍
这是一个完整的饭店管理系统，包含：
- 📱 小程序端（Vue.js）
- 💻 后台管理系统（Vue + Element UI）
- 🔧 后端服务（SpringBoot）

## 📋 前置要求
请确保已安装以下软件：
- ✅ JDK 1.8+
- ✅ Maven 3.6+
- ✅ MySQL 8.0
- ✅ Node.js 14+
- ✅ 微信开发者工具（小程序开发）

## 🚀 快速启动

### 第一步：初始化数据库

#### 方法1：使用命令行
```bash
mysql -u root -p123456 < backend/src/main/resources/sql/init.sql
```

#### 方法2：使用MySQL客户端
1. 打开MySQL Workbench或Navicat
2. 连接到本地MySQL服务（用户名: root, 密码: 123456）
3. 执行SQL脚本：`backend/src/main/resources/sql/init.sql`

### 第二步：启动后端服务

#### 方法1：使用命令行
```bash
cd backend
mvn spring-boot:run
```

#### 方法2：使用IDE
1. 用IntelliJ IDEA或Eclipse导入backend目录
2. 等待Maven依赖下载完成
3. 运行 `RestaurantApplication.java`

**启动成功标志：**
```
===========================================
饭店管理系统启动成功！
接口文档地址: http://localhost:8080/api
===========================================
```

### 第三步：启动后台管理系统

```bash
cd frontend/admin
npm install
npm run serve
```

**访问地址：** http://localhost:8081

**默认账号：**
- 用户名：admin
- 密码：123456

### 第四步：运行小程序

1. 打开微信开发者工具
2. 导入项目：选择 `frontend/miniprogram` 目录
3. AppID选择"测试号"
4. 点击"编译"运行

**注意：** 需要在微信开发者工具中配置不校验合法域名

## 🔍 功能演示

### 后端API测试
使用Postman或浏览器访问：

1. **登录接口**
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

2. **获取门店列表**
```
GET http://localhost:8080/api/store/list?pageNum=1&pageSize=10
```

3. **获取推荐菜品**
```
GET http://localhost:8080/api/dish/recommend?limit=10
```

### 后台管理系统演示
1. 访问 http://localhost:8081
2. 使用 admin/123456 登录
3. 查看数据总览（实时数据统计）
4. 管理门店、菜品、订单

### 小程序演示
1. 在微信开发者工具中编译运行
2. 浏览首页推荐内容
3. 查看门店列表
4. 浏览菜品详情
5. 添加购物车
6. 创建订单

## 📦 项目结构
```
fandianapp/
├── backend/                     # 后端服务
│   ├── src/main/java/com/restaurant/
│   │   ├── controller/          # 接口控制器
│   │   ├── service/             # 业务逻辑
│   │   ├── mapper/              # 数据访问
│   │   ├── entity/              # 实体类
│   │   └── config/              # 配置类
│   ├── src/main/resources/
│   │   ├── application.yml      # 配置文件
│   │   └── sql/init.sql         # 数据库脚本
│   └── pom.xml                  # Maven配置
│
├── frontend/
│   ├── miniprogram/             # 小程序
│   │   ├── pages/               # 页面
│   │   ├── app.js               # 全局逻辑
│   │   ├── app.json             # 全局配置
│   │   └── app.wxss             # 全局样式
│   │
│   └── admin/                   # 后台管理系统
│       ├── src/
│       │   ├── views/           # 页面组件
│       │   ├── router/          # 路由配置
│       │   ├── store/           # 状态管理
│       │   └── utils/           # 工具类
│       └── package.json         # npm配置
│
├── README.md                    # 项目说明
├── PROJECT_SUMMARY.md           # 项目总结
└── start.bat                    # Windows启动脚本
```

## 🔧 常见问题

### Q1: 后端启动失败，提示数据库连接错误
**解决方案：**
1. 检查MySQL服务是否启动
2. 确认数据库用户名和密码是否正确
3. 修改 `backend/src/main/resources/application.yml` 中的数据库配置

### Q2: 前端页面无法访问后端接口
**解决方案：**
1. 确认后端服务已启动
2. 检查端口8080是否被占用
3. 查看浏览器控制台的错误信息

### Q3: 小程序无法请求数据
**解决方案：**
1. 在微信开发者工具中勾选"不校验合法域名"
2. 确认后端服务正常运行
3. 检查小程序的baseUrl配置

### Q4: npm install 很慢
**解决方案：**
使用国内镜像源
```bash
npm config set registry https://registry.npmmirror.com
```

## 📚 技术文档

### 核心技术栈
- **后端**: SpringBoot 2.7.14 + MyBatis Plus 3.5.3
- **前端**: Vue 2.6 + Element UI 2.15
- **数据库**: MySQL 8.0
- **认证**: JWT

### 主要接口列表

#### 认证
- POST /api/auth/login - 登录
- POST /api/auth/register - 注册

#### 门店管理
- GET /api/store/list - 门店列表
- GET /api/store/{id} - 门店详情
- POST /api/store - 创建门店
- PUT /api/store - 更新门店
- DELETE /api/store/{id} - 删除门店

#### 菜品管理
- GET /api/dish/list - 菜品列表
- GET /api/dish/{id} - 菜品详情
- GET /api/dish/recommend - 推荐菜品
- GET /api/dish/new - 新品菜品
- POST /api/dish - 创建菜品
- PUT /api/dish - 更新菜品
- DELETE /api/dish/{id} - 删除菜品

#### 订单管理
- POST /api/order/create - 创建订单
- GET /api/order/myOrders - 我的订单
- GET /api/order/{id} - 订单详情
- POST /api/order/{id}/pay - 支付订单
- POST /api/order/{id}/cancel - 取消订单

#### 购物车
- POST /api/cart/add - 添加到购物车
- GET /api/cart/list - 购物车列表
- PUT /api/cart/{id}/quantity - 更新数量
- DELETE /api/cart/{id} - 删除购物车项
- DELETE /api/cart/clear - 清空购物车

## 🎯 功能清单

### ✅ 已完成功能
- 用户登录注册
- 门店管理（增删改查）
- 菜品管理（增删改查）
- 购物车功能
- 订单创建和管理
- 数据统计展示
- 后台管理基础框架
- 小程序基础框架

### ⏳ 待开发功能
- 图片上传
- 微信支付
- 短信验证码
- 优惠券使用
- 订单评价
- 会员积分详细规则
- 消息推送
- 数据导出

## 💡 开发建议
1. 后端接口遵循RESTful规范
2. 统一使用Result封装返回结果
3. 所有接口需要JWT认证（登录注册除外）
4. 分页查询统一使用PageQuery
5. 前端统一使用Axios封装请求
6. 小程序使用app.request统一请求

## 📞 技术支持
如有问题，请查看：
1. README.md - 项目说明
2. PROJECT_SUMMARY.md - 项目总结
3. 数据库脚本注释 - SQL文件中的详细说明

## 📝 更新日志

### v1.0.0 (2025-11-18)
- ✨ 完成后端核心API开发
- ✨ 完成数据库设计和初始化
- ✨ 完成后台管理系统基础框架
- ✨ 完成小程序基础框架和首页
- 📝 完善项目文档

---
**祝您使用愉快！** 🎊
