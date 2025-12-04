<template>
  <div class="dish-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="菜品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入菜品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属门店">
          <el-select v-model="searchForm.storeId" placeholder="请选择门店" clearable>
            <el-option v-for="store in storeList" :key="store.id" :label="store.storeName" :value="store.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜品分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option v-for="category in categoryList" :key="category.id" :label="category.categoryName" :value="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增菜品</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="dishName" label="菜品名称"></el-table-column>
        <el-table-column prop="storeName" label="门店名称"></el-table-column>
        <el-table-column prop="categoryName" label="分类"></el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template slot-scope="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" width="100">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.rating" :colors="['#f5222d', '#ff7a45', '#ffbf00']" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="monthlySales" label="月销量" width="100"></el-table-column>
        <el-table-column label="推荐" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isRecommend === 1 ? 'success' : 'info'">
              {{ scope.row.isRecommend === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleToggleStatus(scope.row)">{{ scope.row.status === 1 ? '下架' : '上架' }}</el-button>
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
    <el-dialog :title="formData.id ? '编辑菜品' : '新增菜品'" :visible.sync="dialogVisible" width="600px">
      <el-form :model="formData" label-width="100px" ref="form">
        <el-form-item label="菜品名称" prop="dishName">
          <el-input v-model="formData.dishName" placeholder="请输入菜品名称"></el-input>
        </el-form-item>
        <el-form-item label="所属门店" prop="storeId">
          <el-select v-model="formData.storeId" placeholder="请选择门店">
            <el-option v-for="store in storeList" :key="store.id" :label="store.storeName" :value="store.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜品分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择分类">
            <el-option v-for="category in categoryList" :key="category.id" :label="category.categoryName" :value="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price">
          <el-input v-model.number="formData.price" placeholder="请输入价格" type="number"></el-input>
        </el-form-item>
        <el-form-item label="菜品描述" prop="description">
          <el-input v-model="formData.description" placeholder="请输入描述" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="formData.rating" :colors="['#f5222d', '#ff7a45', '#ffbf00']"></el-rate>
        </el-form-item>
        <el-form-item label="推荐">
          <el-switch v-model="formData.isRecommend" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="上架状态">
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
  name: 'DishList',
  data() {
    return {
      searchForm: {
        keyword: '',
        storeId: '',
        categoryId: ''
      },
      tableData: [],
      storeList: [],
      categoryList: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      formData: {
        id: '',
        dishName: '',
        storeId: '',
        categoryId: '',
        price: '',
        description: '',
        rating: 5,
        isRecommend: 0,
        status: 1
      }
    };
  },
  mounted() {
    this.loadStores();
    this.loadCategories();
    this.loadData();
  },
  methods: {
    loadStores() {
      this.$axios.get('/store/list', { params: { pageSize: 999 } }).then(data => {
        this.storeList = data.records || [];
      });
    },
    loadCategories() {
      this.$axios.get('/dish-category/list', { params: { pageSize: 999 } }).then(data => {
        this.categoryList = data.records || [];
      }).catch(() => {
        this.categoryList = [];
      });
    },
    loadData() {
      this.$axios.get('/dish/list', {
        params: {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          keyword: this.searchForm.keyword,
          storeId: this.searchForm.storeId,
          categoryId: this.searchForm.categoryId
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
      this.searchForm = { keyword: '', storeId: '', categoryId: '' };
      this.pagination.pageNum = 1;
      this.loadData();
    },
    handleAdd() {
      this.formData = { id: '', dishName: '', storeId: '', categoryId: '', price: '', description: '', rating: 5, isRecommend: 0, status: 1 };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.formData = { ...row };
      this.dialogVisible = true;
    },
    handleSave() {
      if (!this.formData.dishName) {
        this.$message.error('菜品名称不能为空');
        return;
      }
      const url = this.formData.id ? `/dish/${this.formData.id}` : '/dish';
      const method = this.formData.id ? 'put' : 'post';
      this.$axios[method](url, this.formData).then(() => {
        this.$message.success(this.formData.id ? '编辑成功' : '新增成功');
        this.dialogVisible = false;
        this.loadData();
      });
    },
    handleToggleStatus(row) {
      const newStatus = row.status === 1 ? 0 : 1;
      this.$axios.patch(`/dish/${row.id}/status`, { status: newStatus }).then(() => {
        this.$message.success('状态更新成功');
        this.loadData();
      });
    },
    handleDelete(row) {
      this.$confirm('确定要删除该菜品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/dish/${row.id}`).then(() => {
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
    }
  }
};
</script>

<style scoped>
.dish-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dish-list /deep/ .el-card {
  border: none;
  box-shadow: none;
  background: transparent;
}

.dish-list /deep/ .el-card__body {
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

.dish-list /deep/ .el-table {
  background: transparent;
}

.dish-list /deep/ .el-table__header th {
  background: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #ebeef5;
}

.dish-list /deep/ .el-table__body tr:hover > td {
  background-color: #f5f7fa !important;
}

.dish-list /deep/ .el-table td {
  border-bottom: 1px solid #f0f0f0;
}

.dish-list /deep/ .el-button-text {
  color: #409EFF;
  font-weight: 500;
  transition: all 0.3s ease;
}

.dish-list /deep/ .el-button-text:hover {
  color: #0084ff;
}

.dish-list /deep/ .el-tag {
  border-radius: 4px;
  font-weight: 500;
}

.dish-list /deep/ .el-pagination {
  text-align: right;
  margin-top: 20px;
}

.dish-list /deep/ .el-dialog {
  border-radius: 8px;
}

.dish-list /deep/ .el-dialog__header {
  background: linear-gradient(90deg, #409EFF 0%, #0084ff 100%);
  border-bottom: 1px solid #ebeef5;
}

.dish-list /deep/ .el-dialog__title {
  color: #fff;
  font-weight: 600;
}

.dish-list /deep/ .el-dialog__close {
  color: #fff;
}
</style>
