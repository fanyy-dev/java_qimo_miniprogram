<template>
  <div class="store-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="门店名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入门店名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增门店</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="storeName" label="门店名称"></el-table-column>
        <el-table-column prop="storeType" label="菜系类型"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="avgPrice" label="人均消费"></el-table-column>
        <el-table-column prop="rating" label="评分"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '营业中' : '已停业' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 新增/编辑门店对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form :model="storeForm" :rules="formRules" ref="storeForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店名称" prop="storeName">
              <el-input v-model="storeForm.storeName" placeholder="请输入门店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜系类型" prop="storeType">
              <el-select v-model="storeForm.storeType" placeholder="请选择菜系类型" style="width: 100%">
                <el-option label="川菜" value="Sichuan"></el-option>
                <el-option label="粤菜" value="Cantonese"></el-option>
                <el-option label="湘菜" value="Hunan"></el-option>
                <el-option label="鲁菜" value="Shandong"></el-option>
                <el-option label="苏菜" value="Jiangsu"></el-option>
                <el-option label="浙菜" value="Zhejiang"></el-option>
                <el-option label="徽菜" value="Anhui"></el-option>
                <el-option label="闽菜" value="Fujian"></el-option>
                <el-option label="西餐" value="Western"></el-option>
                <el-option label="日料" value="Japanese"></el-option>
                <el-option label="韩餐" value="Korean"></el-option>
                <el-option label="其他" value="Other"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="storeForm.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人均消费" prop="avgPrice">
              <el-input-number v-model="storeForm.avgPrice" :min="0" :precision="0" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="省份" prop="province">
              <el-input v-model="storeForm.province" placeholder="请输入省份"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市" prop="city">
              <el-input v-model="storeForm.city" placeholder="请输入城市"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区县" prop="district">
              <el-input v-model="storeForm.district" placeholder="请输入区县"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="详细地址" prop="address">
          <el-input v-model="storeForm.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="营业时间" prop="businessHours">
              <el-input v-model="storeForm.businessHours" placeholder="如: 09:00-22:00"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总座位数" prop="totalSeats">
              <el-input-number v-model="storeForm.totalSeats" :min="0" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input-number v-model="storeForm.longitude" :precision="6" :step="0.000001" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input-number v-model="storeForm.latitude" :precision="6" :step="0.000001" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="门店标签">
          <el-input v-model="storeForm.tags" placeholder="多个标签用逗号分隔，如: 环境优雅,服务周到"></el-input>
        </el-form-item>

        <el-form-item label="门店描述">
          <el-input
            type="textarea"
            v-model="storeForm.description"
            :rows="3"
            placeholder="请输入门店描述"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="storeForm.status">
            <el-radio :label="1">营业中</el-radio>
            <el-radio :label="0">已停业</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StoreList',
  data() {
    return {
      searchForm: {
        keyword: ''
      },
      tableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '新增门店',
      submitLoading: false,
      storeForm: {
        storeName: '',
        storeType: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
        longitude: null,
        latitude: null,
        businessHours: '',
        avgPrice: 0,
        description: '',
        tags: '',
        totalSeats: 0,
        status: 1
      },
      formRules: {
        storeName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        storeType: [
          { required: true, message: '请选择菜系类型', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的电话号码', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        avgPrice: [
          { required: true, message: '请输入人均消费', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$axios.get('/store/list', {
        params: {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          keyword: this.searchForm.keyword
        }
      }).then(data => {
        this.tableData = data.records;
        this.pagination.total = data.total;
      });
    },
    handleSearch() {
      this.pagination.pageNum = 1;
      this.loadData();
    },
    handleReset() {
      this.searchForm = { keyword: '' };
      this.pagination.pageNum = 1;
      this.loadData();
    },
    handleAdd() {
      this.dialogTitle = '新增门店';
      this.storeForm = {
        storeName: '',
        storeType: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
        longitude: null,
        latitude: null,
        businessHours: '',
        avgPrice: 0,
        description: '',
        tags: '',
        totalSeats: 0,
        status: 1
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑门店';
      this.storeForm = { ...row };
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('确定要删除该门店吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/store/${row.id}`)
          .then(() => {
            this.$message.success('删除成功');
            this.loadData();
          });
      }).catch(() => {});
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val;
      this.loadData();
    },
    handleSubmit() {
      this.$refs.storeForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const apiMethod = this.storeForm.id ? 'put' : 'post';
          const successMsg = this.storeForm.id ? '修改成功' : '新增成功';
          
          this.$axios[apiMethod]('/store', this.storeForm)
            .then(() => {
              this.$message.success(successMsg);
              this.dialogVisible = false;
              this.loadData();
            })
            .finally(() => {
              this.submitLoading = false;
            });
        }
      });
    },
    handleDialogClose() {
      this.$refs.storeForm.resetFields();
    }
  }
};
</script>

<style scoped>
.store-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px 8px 0 0;
}

.search-form /deep/ .el-form-item {
  margin-bottom: 0;
}

.search-form /deep/ .el-input {
  border-radius: 4px;
}

.search-form /deep/ .el-input__inner {
  height: 36px;
  border: 1px solid #dcdfe6;
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

.store-list /deep/ .el-card {
  border: none;
  box-shadow: none;
  background: transparent;
}

.store-list /deep/ .el-card__body {
  padding: 20px;
}

.store-list /deep/ .el-table {
  background: transparent;
}

.store-list /deep/ .el-table__header th {
  background: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #ebeef5;
}

.store-list /deep/ .el-table__body tr:hover > td {
  background-color: #f5f7fa !important;
}

.store-list /deep/ .el-table td {
  border-bottom: 1px solid #f0f0f0;
}

.store-list /deep/ .el-button-text {
  color: #409EFF;
  font-weight: 500;
  transition: all 0.3s ease;
}

.store-list /deep/ .el-button-text:hover {
  color: #0084ff;
}

.store-list /deep/ .el-pagination {
  text-align: right;
  margin-top: 20px;
}

.store-list /deep/ .el-dialog {
  border-radius: 8px;
}

.store-list /deep/ .el-dialog__header {
  background: linear-gradient(90deg, #409EFF 0%, #0084ff 100%);
  border-bottom: 1px solid #ebeef5;
}

.store-list /deep/ .el-dialog__title {
  color: #fff;
  font-weight: 600;
}

.store-list /deep/ .el-dialog__close {
  color: #fff;
}
</style>
