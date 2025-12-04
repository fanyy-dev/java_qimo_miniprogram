<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in stats" :key="index">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: item.color }">
              <i :class="item.icon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <div slot="header">今日订单统计</div>
          <div ref="orderChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">热销菜品TOP10</div>
          <div ref="dishChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'Dashboard',
  data() {
    return {
      stats: [
        { label: '今日订单', value: '128', icon: 'el-icon-document', color: '#409EFF' },
        { label: '今日营业额', value: '¥15,680', icon: 'el-icon-coin', color: '#67C23A' },
        { label: '用户总数', value: '8,560', icon: 'el-icon-user', color: '#E6A23C' },
        { label: '门店数量', value: '12', icon: 'el-icon-office-building', color: '#F56C6C' }
      ]
    };
  },
  mounted() {
    this.initCharts();
    this.loadStats();
  },
  methods: {
    loadStats() {
      // 调用API获取统计信息
      Promise.all([
        this.$axios.get('/order/today-count').catch(() => 0),
        this.$axios.get('/order/today-amount').catch(() => 0),
        this.$axios.get('/user/total-count').catch(() => 0),
        this.$axios.get('/store/list', { params: { pageSize: 999 } }).catch(() => ({ records: [] }))
      ]).then(([orderCount, orderAmount, userCount, storeData]) => {
        this.stats = [
          { label: '今日订单', value: (orderCount || 0).toString(), icon: 'el-icon-document', color: '#409EFF' },
          { label: '今日营业额', value: '¥' + (orderAmount || 0), icon: 'el-icon-coin', color: '#67C23A' },
          { label: '用户总数', value: (userCount || 0).toString(), icon: 'el-icon-user', color: '#E6A23C' },
          { label: '门店数量', value: (storeData && storeData.records ? storeData.records.length : 0).toString(), icon: 'el-icon-office-building', color: '#F56C6C' }
        ];
      });
    },
    initCharts() {
      // 订单统计图表
      const orderChart = echarts.init(this.$refs.orderChart);
      
      // 加载今日各时段订单统计数据
      this.$axios.get('/order/today-hourly-stats').then(res => {
        const chartData = res.data || { labels: [], data: [] };
        orderChart.setOption({
          tooltip: { trigger: 'axis' },
          xAxis: { 
            type: 'category', 
            data: chartData.labels || ['0-2时', '2-4时', '4-6时', '6-8时', '8-10时', '10-12时', '12-14时', '14-16时', '16-18时', '18-20时', '20-22时', '22-24时']
          },
          yAxis: { type: 'value' },
          series: [{ 
            data: chartData.data || [2, 1, 0, 3, 8, 15, 35, 28, 42, 55, 38, 12], 
            type: 'line', 
            smooth: true,
            itemStyle: { color: '#409EFF' },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                  { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
                ]
              }
            }
          }]
        });
      }).catch(() => {
        // 使用默认数据
        orderChart.setOption({
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: ['0-2时', '2-4时', '4-6时', '6-8时', '8-10时', '10-12时', '12-14时', '14-16时', '16-18时', '18-20时', '20-22时', '22-24时'] },
          yAxis: { type: 'value' },
          series: [{ data: [2, 1, 0, 3, 8, 15, 35, 28, 42, 55, 38, 12], type: 'line', smooth: true }]
        });
      });

      // 热销菜品图表
      const dishChart = echarts.init(this.$refs.dishChart);
      
      // 加载热销菜品数据
      this.$axios.get('/dish/top-sales', { params: { limit: 10 } }).then(res => {
        const dishes = res.data || [];
        const dishNames = dishes.map(d => d.dishName).reverse();
        const salesData = dishes.map(d => d.saleCount || 0).reverse();
        
        dishChart.setOption({
          tooltip: { 
            trigger: 'axis', 
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
              return params[0].name + '<br/>销量: ' + params[0].value;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: { type: 'value' },
          yAxis: { 
            type: 'category', 
            data: dishNames.length > 0 ? dishNames : ['菜品10', '菜品9', '菜品8', '菜品7', '菜品6', '菜品5', '菜品4', '菜品3', '菜品2', '菜品1']
          },
          series: [{ 
            data: salesData.length > 0 ? salesData : [120, 132, 150, 168, 180, 195, 210, 230, 260, 288], 
            type: 'bar',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [
                  { offset: 0, color: '#67C23A' },
                  { offset: 1, color: '#85ce61' }
                ]
              }
            },
            barWidth: '60%'
          }]
        });
      }).catch(() => {
        // 使用默认数据
        dishChart.setOption({
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          xAxis: { type: 'value' },
          yAxis: { type: 'category', data: ['菜品10', '菜品9', '菜品8', '菜品7', '菜品6', '菜品5', '菜品4', '菜品3', '菜品2', '菜品1'] },
          series: [{ data: [120, 132, 150, 168, 180, 195, 210, 230, 260, 288], type: 'bar' }]
        });
      });
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  margin-right: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}
</style>
