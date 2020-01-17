// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './core/router-guards' // 路由守卫
import './utils/filter' // global filter
import './assets/style/global.less'
import { checkPermission } from './utils/util'
Vue.config.productionTip = false

Vue.use(VueAxios)

// 文件服务器地址
Vue.prototype.checkPermission = checkPermission
Vue.prototype.fileServer = 'http://127.0.0.1:8888/v1'
Vue.prototype.tableSize = 'middle'

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
