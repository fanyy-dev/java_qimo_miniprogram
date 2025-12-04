import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/Index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '数据总览' }
      },
      {
        path: 'store/list',
        name: 'StoreList',
        component: () => import('@/views/store/List.vue'),
        meta: { title: '门店管理' }
      },
      {
        path: 'dish/list',
        name: 'DishList',
        component: () => import('@/views/dish/List.vue'),
        meta: { title: '菜品管理' }
      },
      {
        path: 'order/list',
        name: 'OrderList',
        component: () => import('@/views/order/List.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'user/list',
        name: 'UserList',
        component: () => import('@/views/user/List.vue'),
        meta: { title: '用户管理' }
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'hash',
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.path === '/login') {
    next();
  } else {
    if (token) {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
