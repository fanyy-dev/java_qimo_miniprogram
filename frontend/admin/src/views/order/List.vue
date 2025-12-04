<template>
  <div class="order-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option label="待接单" value="PENDING"></el-option>
            <el-option label="已接单" value="ACCEPTED"></el-option>
            <el-option label="制作中" value="PREPARING"></el-option>
            <el-option label="待取餐" value="READY"></el-option>
            <el-option label="配送中" value="DELIVERING"></el-option>
            <el-option label="已完成" value="COMPLETED"></el-option>
            <el-option label="已取消" value="CANCELLED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="150"></el-table-column>
        <el-table-column prop="storeName" label="门店"></el-table-column>
        <el-table-column prop="contactName" label="联系人"></el-table-column>
        <el-table-column prop="contactPhone" label="联系电话" width="120"></el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="100">
          <template slot-scope="scope">¥{{ scope.row.actualAmount || scope.row.totalAmount }}</template>
        </el-table-column>
        <el-table-column label="订单类型" width="100">
          <template slot-scope="scope">
            <el-tag :type="getOrderTypeColor(scope.row.orderType)">
              {{ getOrderTypeLabel(scope.row.orderType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusColor(scope.row.orderStatus)">
              {{ getStatusLabel(scope.row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" v-if="scope.row.orderStatus === 'PENDING'" @click="handleAccept(scope.row)">接单</el-button>
            <el-button type="text" size="small" v-if="scope.row.orderStatus === 'ACCEPTED'" @click="handleUpdate(scope.row, 'PREPARING')">开始制作</el-button>
            <el-button type="text" size="small" v-if="scope.row.orderStatus === 'PREPARING'" @click="handleUpdate(scope.row, 'READY')">待取餐</el-button>
            <el-button type="text" size="small" style="color: #f56c6c" v-if="!['COMPLETED', 'CANCELLED'].includes(scope.row.orderStatus)" @click="handleCancel(scope.row)">取消</el-button>
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

    <!-- 详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="700px">
      <el-descriptions :column="2" border v-if="selectedOrder">
        <el-descriptions-item label="订单号">{{ selectedOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="门店">{{ selectedOrder.storeName }}</el-descriptions-item>
        <el-descriptions-item label="订单类型">{{ getOrderTypeLabel(selectedOrder.orderType) }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">{{ getStatusLabel(selectedOrder.orderStatus) }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ selectedOrder.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ selectedOrder.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="订单金额" :span="2">¥{{ selectedOrder.actualAmount || selectedOrder.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="沿靠" :span="2" v-if="selectedOrder.deliveryAddress">{{ selectedOrder.deliveryAddress }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2" v-if="selectedOrder.remark">{{ selectedOrder.remark }}</el-descriptions-item>
        <el-descriptions-item label="下单时间" :span="2">{{ selectedOrder.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  data() {
    return {
      searchForm: {
        orderNo: '',
        orderStatus: ''
      },
      dateRange: [],
      tableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      detailDialogVisible: false,
      selectedOrder: null,
      orderTypeMap: {
        'DINE_IN': '堂食',
        'TAKEOUT': '外卖',
        'RESERVE': '预订'
      },
      statusMap: {
        'PENDING': '待接单',
        'ACCEPTED': '已接单',
        'PREPARING': '制作中',
        'READY': '待取餐',
        'DELIVERING': '配送中',
        'COMPLETED': '已完成',
        'CANCELLED': '已取消'
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      const params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        orderNo: this.searchForm.orderNo,
        orderStatus: this.searchForm.orderStatus
      };
      if (this.dateRange && this.dateRange.length > 0) {
        params.startDate = this.dateRange[0];
        params.endDate = this.dateRange[1];
      }
      this.$axios.get('/order/list', { params }).then(data => {
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
      this.searchForm = { orderNo: '', orderStatus: '' };
      this.dateRange = [];
      this.pagination.pageNum = 1;
      this.loadData();
    },
    handleView(row) {
      this.selectedOrder = row;
      this.detailDialogVisible = true;
    },
    handleAccept(row) {
      this.$confirm('确定要接待该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleUpdate(row, 'ACCEPTED');
      }).catch(() => {});
    },
    handleUpdate(row, status) {
      this.$axios.patch(`/order/${row.id}/status`, { orderStatus: status }).then(() => {
        this.$message.success('订单符号更新成功');
        this.detailDialogVisible = false;
        this.loadData();
      }).catch(err => {
        this.$message.error('更新失败');
      });
    },
    handleCancel(row) {
      this.$prompt('请输入取消原因', '取消订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '取消原因不能为空'
      }).then(({ value }) => {
        this.$axios.patch(`/order/${row.id}/cancel`, { cancelReason: value }).then(() => {
          this.$message.success('订单已取消');
          this.loadData();
        });
      }).catch(() => {});
    },
    getStatusLabel(status) {
      return this.statusMap[status] || status;
    },
    getStatusColor(status) {
      const colorMap = {
        'PENDING': 'warning',
        'ACCEPTED': 'info',
        'PREPARING': 'info',
        'READY': 'success',
        'DELIVERING': 'info',
        'COMPLETED': 'success',
        'CANCELLED': 'danger'
      };
      return colorMap[status] || 'info';
    },
    getOrderTypeLabel(type) {
      return this.orderTypeMap[type] || type;
    },
    getOrderTypeColor(type) {
      const colorMap = {
        'DINE_IN': 'success',
        'TAKEOUT': 'warning',
        'RESERVE': 'info'
      };
      return colorMap[type] || 'info';
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
.order-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.order-list /deep/ .el-card {
  border: none;
  box-shadow: none;
  background: transparent;
}

.order-list /deep/ .el-card__body {
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
  margin-bottom: 12px;
}

.search-form /deep/ .el-input,
.search-form /deep/ .el-select,
.search-form /deep/ .el-date-editor {
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

.order-list /deep/ .el-table {
  background: transparent;
}

.order-list /deep/ .el-table__header th {
  background: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #ebeef5;
}

.order-list /deep/ .el-table__body tr:hover > td {
  background-color: #f5f7fa !important;
}

.order-list /deep/ .el-table td {
  border-bottom: 1px solid #f0f0f0;
}

.order-list /deep/ .el-button-text {
  color: #409EFF;
  font-weight: 500;
  transition: all 0.3s ease;
}

.order-list /deep/ .el-button-text:hover {
  color: #0084ff;
}

.order-list /deep/ .el-tag {
  border-radius: 4px;
  font-weight: 500;
}

.order-list /deep/ .el-pagination {
  text-align: right;
  margin-top: 20px;
}

.order-list /deep/ .el-dialog {
  border-radius: 8px;
}

.order-list /deep/ .el-dialog__header {
  background: linear-gradient(90deg, #409EFF 0%, #0084ff 100%);
  border-bottom: 1px solid #ebeef5;
}

.order-list /deep/ .el-dialog__title {
  color: #fff;
  font-weight: 600;
}

.order-list /deep/ .el-dialog__close {
  color: #fff;
}

.order-list /deep/ .el-descriptions {
  background: #f5f7fa;
}

.order-list /deep/ .el-descriptions__header {
  background: #fff;
}
</style>
