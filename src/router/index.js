import Vue from 'vue'
import VueRouter from 'vue-router'


// import Login from '../components/Login.vue'
const Login = () => import( /* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import( /* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import( /* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import( /* webpackChunkName: "User_Right_Roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import( /* webpackChunkName: "User_Right_Roles" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import( /* webpackChunkName: "User_Right_Roles" */ '../components/power/Roles.vue')


// import GoosList from '../components/goods/List.vue'
const GoosList = () => import( /* webpackChunkName: "GoodsList_Add_Edit" */ '../components/goods/List.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import( /* webpackChunkName: "GoodsList_Add_Edit" */ '../components/goods/Add.vue')
const Edit = () => import( /* webpackChunkName: "GoodsList_Add_Edit" */ '../components/goods/Edit.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () => import( /* webpackChunkName: "Cate_TreeTable_Params" */ '../components/goods/Cate.vue')
// import TreeTable from 'vue-table-with-tree-grid'
const TreeTable = () => import( /* webpackChunkName: "Cate_TreeTable_Params" */ 'vue-table-with-tree-grid')
// import Params from '../components/goods/Params.vue'
const Params = () => import( /* webpackChunkName: "Cate_TreeTable_Params" */ '../components/goods/Params.vue')


// import Order from '../components/order/Order.vue'
const Order = () => import( /* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
// import Report from '@/components/report/Report'
const Report = () => import( /* webpackChunkName: "Order_Report" */ '../components/report/Report')





Vue.component('tree-table', TreeTable)
Vue.use(VueRouter)

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
    }, {
      path: '/goods/edit',
      component: Edit
    }, {
      path: "/orders",
      component: Order
    }, {
      path: '/reports',
      component: Report
    }]
  }
]

const router = new VueRouter({
  mode: 'hash',
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