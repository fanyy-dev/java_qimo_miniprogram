<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <div class="logo">
          <i class="el-icon-s-management" style="margin-right: 10px;"></i>
          <span>饭店管理系统</span>
        </div>
        <el-menu
          :default-active="$route.path"
          router
          background-color="#001a33"
          text-color="#bfcbd9"
          active-text-color="#00d4ff"
          class="sidebar-menu"
        >
          <el-menu-item index="/dashboard">
            <i class="el-icon-data-line"></i>
            <span slot="title">数据总览</span>
          </el-menu-item>
          <el-menu-item index="/store/list">
            <i class="el-icon-office-building"></i>
            <span slot="title">门店管理</span>
          </el-menu-item>
          <el-menu-item index="/dish/list">
            <i class="el-icon-food"></i>
            <span slot="title">菜品管理</span>
          </el-menu-item>
          <el-menu-item index="/order/list">
            <i class="el-icon-document"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="/user/list">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体区域 -->
      <el-container>
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <i class="el-icon-user-solid"></i>
                {{ userInfo.nickname || userInfo.username }}
                <i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区 -->
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$confirm('确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('logout');
          this.$router.push('/login');
          this.$message.success('已退出登录');
        }).catch(() => {});
      }
    }
  }
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.aside {
  background: linear-gradient(180deg, #001a33 0%, #0d1b2a 100%);
  height: 100vh;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.logo {
  height: 60px;
  line-height: 60px;
  padding: 0 15px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #00d4ff 0%, #0084ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 212, 255, 0.3);
  letter-spacing: 1px;
}

.logo i {
  font-size: 22px;
}

.sidebar-menu {
  border-right: none !important;
  padding-top: 10px;
}

.sidebar-menu /deep/ .el-menu-item {
  color: #a6b1bf;
  transition: all 0.3s ease;
}

.sidebar-menu /deep/ .el-menu-item:hover {
  background-color: rgba(0, 212, 255, 0.1) !important;
  color: #00d4ff;
  padding-left: 25px;
}

.sidebar-menu /deep/ .el-menu-item.is-active {
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.2), transparent) !important;
  border-left: 3px solid #00d4ff;
  color: #00d4ff !important;
}

.header {
  background: linear-gradient(90deg, #fff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #ebeef5;
  height: 60px;
}

.user-info {
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: #f0f0f0;
  color: #00d4ff;
}

.main {
  background: #f0f2f5;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}
</style>
