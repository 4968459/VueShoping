import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import TreeTable from 'vue-table-with-tree-grid'
import Params from '../components/goods/Params.vue'
import GoosList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue';

Vue.component('tree-table', TreeTable)
Vue.use(VueRouter)
Vue.filter("dataFormat", originVal => {
  var date = new Date(originVal * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    sdate = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minute = ("0" + date.getMinutes()).slice(-2),
    second = ("0" + date.getSeconds()).slice(-2);
  // 拼接
  var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
  // 返回
  return result;
});

const routes = [{
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }, {
      path: '/goods',
      component: GoosList
    }, {
      path: '/goods/add',
      component: Add
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载vue路由守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next 是一个函数 ，表示放行 next（路径）
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router