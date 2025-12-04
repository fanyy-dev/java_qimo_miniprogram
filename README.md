# 饭店小程序管理系统

## 项目简介
基于 SpringBoot + Vue 的饭店小程序管理系统，包含前台小程序和后台管理系统。

## 技术栈
### 后端
- SpringBoot 2.7.14
- MyBatis Plus 3.5.3.1
- MySQL 8.0
- Redis
- JWT
- Druid

### 前端
- 小程序：原生微信小程序 + Vue.js
- 后台：Vue 2.x + Element UI

## 功能模块

### 前台小程序功能
1. **用户中心模块**
   - 智能登录系统(账号密码/手机验证码)
   - 会员体系(普通/银卡/金卡/钻石)
   - 个人信息管理
   - 地址管理
   - 消息中心

2. **餐厅展示模块**
   - 首页智能推荐
   - 门店列表与筛选
   - 门店详情
   - 菜品浏览
   - 搜索功能

3. **点餐预订模块**
   - 在线点餐(堂食/外卖/预约)
   - 菜品定制
   - 购物车管理
   - 预订功能
   - 订单确认

4. **订单管理模块**
   - 订单状态跟踪
   - 订单操作
   - 售后评价

5. **营销互动模块**
   - 优惠活动
   - 会员特权
   - 积分兑换

### 后台管理功能
1. **数据总览模块**
   - 经营看板
   - 销售分析
   - 预警监控

2. **门店管理模块**
   - 门店信息管理
   - 桌位管理
   - 员工管理
   - 系统设置

3. **菜品管理模块**
   - 菜品管理
   - 分类管理
   - 库存管理
   - 套餐管理

4. **订单管理模块**
   - 订单处理
   - 订单查询
   - 后厨管理
   - 配送管理

5. **会员管理模块**
   - 会员信息
   - 会员营销
   - 消息推送

6. **营销管理模块**
   - 活动管理
   - 优惠券管理
   - 广告管理

## 数据库配置
```properties
数据库名: restaurant_db
用户名: root
密码: 123456
端口: 3306
```

## 快速开始

### 1. 数据库初始化
```bash
# 执行 SQL 脚本
mysql -u root -p123456 < backend/src/main/resources/sql/init.sql
```

### 2. 启动后端
```bash
cd backend
mvn spring-boot:run
```
后端服务将运行在: http://localhost:8080/api

### 3. 启动前端

#### 小程序
```bash
cd frontend/miniprogram
# 使用微信开发者工具打开此目录
```

#### 后台管理系统
```bash
cd frontend/admin
npm install
npm run serve
```

## 主要接口

### 认证接口
- POST /api/auth/login - 用户登录
- POST /api/auth/register - 用户注册

### 门店接口
- GET /api/store/list - 门店列表
- GET /api/store/{id} - 门店详情
- POST /api/store - 创建门店
- PUT /api/store - 更新门店
- DELETE /api/store/{id} - 删除门店

### 菜品接口
- GET /api/dish/list - 菜品列表
- GET /api/dish/{id} - 菜品详情
- GET /api/dish/recommend - 推荐菜品
- GET /api/dish/new - 新品菜品
- POST /api/dish - 创建菜品
- PUT /api/dish - 更新菜品
- DELETE /api/dish/{id} - 删除菜品

### 订单接口
- POST /api/order/create - 创建订单
- GET /api/order/myOrders - 我的订单
- GET /api/order/{id} - 订单详情
- POST /api/order/{id}/pay - 支付订单
- POST /api/order/{id}/cancel - 取消订单
- POST /api/order/{id}/updateStatus - 更新订单状态

### 购物车接口
- POST /api/cart/add - 添加到购物车
- GET /api/cart/list - 购物车列表
- PUT /api/cart/{id}/quantity - 更新数量
- DELETE /api/cart/{id} - 删除购物车项
- DELETE /api/cart/clear - 清空购物车

## 默认账号
```
管理员账号: admin
密码: 123456
```

## 项目结构
```
fandianapp/
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/restaurant/
│   │   │   │   ├── common/          # 通用类
│   │   │   │   ├── config/          # 配置类
│   │   │   │   ├── controller/      # 控制器
│   │   │   │   ├── dto/             # 数据传输对象
│   │   │   │   ├── entity/          # 实体类
│   │   │   │   ├── interceptor/     # 拦截器
│   │   │   │   ├── mapper/          # Mapper接口
│   │   │   │   ├── service/         # 服务层
│   │   │   │   └── util/            # 工具类
│   │   │   └── resources/
│   │   │       ├── application.yml  # 配置文件
│   │   │       └── sql/             # SQL脚本
│   │   └── pom.xml                  # Maven配置
│   │
├── frontend/                # 前端项目
│   ├── miniprogram/         # 小程序
│   └── admin/               # 后台管理系统
│
└── README.md                # 项目说明
```

## 注意事项
1. 请确保MySQL服务已启动
2. 修改数据库配置文件中的连接信息
3. 首次运行需执行数据库初始化脚本
4. 建议使用Redis缓存,需要启动Redis服务

## 开发说明
- 后端接口遵循RESTful规范
- 使用JWT进行身份认证
- 所有接口统一返回Result格式
- 支持跨域访问

## 联系方式
如有问题,请联系开发团队
