<template>
  <div class="user-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户不段">
          <el-select v-model="searchForm.userType" placeholder="请选择用户不段" clearable>
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="正常用户" value="USER"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="searchForm.memberLevel" placeholder="请选择会员等级" clearable>
            <el-option label="普通会员" value="NORMAL"></el-option>
            <el-option label="紧伜会员" value="SILVER"></el-option>
            <el-option label="黄金会员" value="GOLD"></el-option>
            <el-option label="镖石会员" value="DIAMOND"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="nickname" label="明起名" width="120"></el-table-column>
        <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="180"></el-table-column>
        <el-table-column label="用户不段" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.userType === 'ADMIN' ? 'danger' : 'info'">
              {{ scope.row.userType === 'ADMIN' ? '管理员' : '正常用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="会员等级" width="100">
          <template slot-scope="scope">
            <el-tag :type="getLevelColor(scope.row.memberLevel)">
              {{ getLevelLabel(scope.row.memberLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="積分" width="100"></el-table-column>
        <el-table-column label="余额" width="100">
          <template slot-scope="scope">¥{{ scope.row.balance }}</template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleToggleStatus(scope.row)">{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
            <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; text-align: right"
      ></el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog :title="formData.id ? '编辑用户' : '新增用户'" :visible.sync="dialogVisible" width="600px">
      <el-form :model="formData" label-width="100px" ref="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="!!formData.id"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!formData.id">
          <el-input v-model="formData.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="明起名" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入明起名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入电子邮箱"></el-input>
        </el-form-item>
        <el-form-item label="用户不段" prop="userType">
          <el-select v-model="formData.userType" placeholder="请选择用户不段">
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="正常用户" value="USER"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员等级" prop="memberLevel">
          <el-select v-model="formData.memberLevel" placeholder="请选择会员等级">
            <el-option label="普通会员" value="NORMAL"></el-option>
            <el-option label="紧伜会员" value="SILVER"></el-option>
            <el-option label="黄金会员" value="GOLD"></el-option>
            <el-option label="镖石会员" value="DIAMOND"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="積分" prop="points">
          <el-input-number v-model="formData.points" :min="0" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model.number="formData.balance" placeholder="请输入余额" type="number"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      searchForm: {
        username: '',
        userType: '',
        memberLevel: ''
      },
      tableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      formData: {
        id: '',
        username: '',
        password: '',
        nickname: '',
        phone: '',
        email: '',
        userType: 'USER',
        memberLevel: 'NORMAL',
        points: 0,
        balance: 0,
        status: 1
      },
      levelMap: {
        'NORMAL': '普通会员',
        'SILVER': '紧伜会员',
        'GOLD': '黄金会员',
        'DIAMOND': '镖石会员'
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$axios.get('/user/list', {
        params: {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          username: this.searchForm.username,
          userType: this.searchForm.userType,
          memberLevel: this.searchForm.memberLevel
        }
      }).then(data => {
        this.tableData = data.records || [];
        this.pagination.total = data.total;
      }).catch(() => {
        this.tableData = [];
      });
    },
    handleSearch() {
      this.pagination.pageNum = 1;
      this.loadData();
    },
    handleReset() {
      this.searchForm = { username: '', userType: '', memberLevel: '' };
      this.pagination.pageNum = 1;
      this.loadData();
    },
    handleAdd() {
      this.formData = { id: '', username: '', password: '', nickname: '', phone: '', email: '', userType: 'USER', memberLevel: 'NORMAL', points: 0, balance: 0, status: 1 };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.formData = { ...row };
      this.dialogVisible = true;
    },
    handleSave() {
      if (!this.formData.username) {
        this.$message.error('用户名不能为空');
        return;
      }
      const url = this.formData.id ? `/user/${this.formData.id}` : '/user';
      const method = this.formData.id ? 'put' : 'post';
      this.$axios[method](url, this.formData).then(() => {
        this.$message.success(this.formData.id ? '编辑成功' : '新增成功');
        this.dialogVisible = false;
        this.loadData();
      });
    },
    handleToggleStatus(row) {
      const newStatus = row.status === 1 ? 0 : 1;
      this.$axios.patch(`/user/${row.id}/status`, { status: newStatus }).then(() => {
        this.$message.success('程序状态更新成功');
        this.loadData();
      });
    },
    handleDelete(row) {
      this.$confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/user/${row.id}`).then(() => {
          this.$message.success('删除成功');
          this.loadData();
        });
      }).catch(() => {});
    },
    getLevelLabel(level) {
      return this.levelMap[level] || level;
    },
    getLevelColor(level) {
      const colorMap = {
        'NORMAL': 'info',
        'SILVER': 'warning',
        'GOLD': 'warning',
        'DIAMOND': 'success'
      };
      return colorMap[level] || 'info';
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val;
      this.loadData();
    }
  }
};
</script>

<style scoped>
.user-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-list /deep/ .el-card {
  border: none;
  box-shadow: none;
  background: transparent;
}

.user-list /deep/ .el-card__body {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px 8px 0 0;
  margin: -20px -20px 20px -20px;
}

.search-form /deep/ .el-form-item {
  margin-bottom: 0;
}

.search-form /deep/ .el-input,
.search-form /deep/ .el-select {
  border-radius: 4px;
}

.search-form /deep/ .el-button {
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-form /deep/ .el-button-primary {
  background: linear-gradient(90deg, #409EFF 0%, #0084ff 100%);
  border: none;
}

.search-form /deep/ .el-button-primary:hover {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  transform: translateY(-2px);
}

.search-form /deep/ .el-button-success {
  background: linear-gradient(90deg, #67C23A 0%, #52c41a 100%);
  border: none;
}

.search-form /deep/ .el-button-success:hover {
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
  transform: translateY(-2px);
}

.user-list /deep/ .el-table {
  background: transparent;
}

.user-list /deep/ .el-table__header th {
  background: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #ebeef5;
}

.user-list /deep/ .el-table__body tr:hover > td {
  background-color: #f5f7fa !important;
}

.user-list /deep/ .el-table td {
  border-bottom: 1px solid #f0f0f0;
}

.user-list /deep/ .el-button-text {
  color: #409EFF;
  font-weight: 500;
  transition: all 0.3s ease;
}

.user-list /deep/ .el-button-text:hover {
  color: #0084ff;
}

.user-list /deep/ .el-tag {
  border-radius: 4px;
  font-weight: 500;
}

.user-list /deep/ .el-pagination {
  text-align: right;
  margin-top: 20px;
}

.user-list /deep/ .el-dialog {
  border-radius: 8px;
}

.user-list /deep/ .el-dialog__header {
  background: linear-gradient(90deg, #409EFF 0%, #0084ff 100%);
  border-bottom: 1px solid #ebeef5;
}

.user-list /deep/ .el-dialog__title {
  color: #fff;
  font-weight: 600;
}

.user-list /deep/ .el-dialog__close {
  color: #fff;
}
</style>
