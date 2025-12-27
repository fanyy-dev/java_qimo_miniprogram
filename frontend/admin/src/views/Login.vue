<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">饭店管理系统</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-tip">
        <p>默认账号: admin</p>
        <p>默认密码: 123456</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      if (this.loading) return;
      
      // 表单验证
      try {
        await this.$refs.loginForm.validate();
      } catch (err) {
        this.$message.warning('请完善登录信息');
        return;
      }
      
      this.loading = true;
      
      try {
        // 调用登录接口
        const res = await this.$axios.post('/auth/login', this.loginForm);
        
        // ========== 关键：打印完整响应，查看结构 ==========
        console.log('=== 登录接口完整响应 ===');
        console.log('原始响应对象:', res);
        console.log('响应数据类型:', typeof res);
        console.log('响应数据结构:', Object.keys(res));
        console.log('res.data:', res.data);
        console.log('res.data数据类型:', typeof res.data);
        console.log('res.data结构:', res.data ? Object.keys(res.data) : 'null/undefined');
        
        // ========== 核心操作：存储数据 + 跳转 ========== 
        
        // 1. 获取响应数据（处理响应拦截器后的数据结构）
        const responseData = res.data || res;
        console.log('responseData:', responseData);
        console.log('responseData结构:', Object.keys(responseData));
        
        // 2. 登录接口已直接返回登录数据，无需检查code
        // 3. 提取登录数据
        const loginData = responseData;
        console.log('loginData:', loginData);
        console.log('loginData结构:', Object.keys(loginData));
        
        const token = loginData.token;
        const userInfoObj = loginData.userInfo;
        
        console.log('提取的token:', token);
        console.log('提取的userInfo:', userInfoObj);
        
        if (!token) {
          console.error('❌ 未找到token字段，可用字段:', Object.keys(responseData));
          throw new Error('登录响应中缺少token');
        }
        
        // 2. 存储token到本地（必须！后续接口需要用）
        localStorage.setItem('token', token);
        
        // 3. 存储用户信息（转成普通对象，避免响应式属性干扰）
        // 因为userInfo是Vue响应式对象，先转JSON再解析，去除__ob__等属性
        const cleanUserInfo = JSON.parse(JSON.stringify(userInfoObj || { username: this.loginForm.username }));
        localStorage.setItem('userInfo', JSON.stringify(cleanUserInfo));
        
        // 4. 更新Vuex store状态
        const loginInfo = {
          token: token,
          userInfo: cleanUserInfo
        };
        
        // 先更新store状态
        this.$store.dispatch('login', loginInfo);
        
        // 5. 跳转到首页（替换当前路由，避免返回登录页）
        // 确保状态完全更新后再跳转
        setTimeout(() => {
          this.$router.replace('/dashboard').catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              console.error('路由跳转异常：', err);
              // 如果跳转失败，手动设置location
              window.location.href = '/dashboard';
            }
          });
        }, 500); // 增加延时，确保认证状态完全生效
        
        // 6. 提示登录成功
        this.$message.success('登录成功！');
        
      } catch (err) {
        console.error('登录失败:', err);
        this.$message.error('登录失败：' + (err.response?.data?.message || err.message || '网络错误'));
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: backgroundMove 20s linear infinite;
}

@keyframes backgroundMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
}

.login-form {
  margin-top: 20px;
}

.login-tip {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}
</style>