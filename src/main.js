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
Vue.use(VueQuillEditor)




Vue.prototype.$http = axios
// 配置请求的基准URL地址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token') //设置响应头
  return config
}, err => {
  console.log(err)
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')