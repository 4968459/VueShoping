import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '../src/assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/font_icon/iconfont.css'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueQuillEditor)

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



Vue.prototype.$http = axios
// 配置请求的基准URL地址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token') //设置响应头
  return config
}, err => {
  console.log(err)
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')