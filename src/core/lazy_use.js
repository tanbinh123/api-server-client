import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from './default-settings'

// base library
import './components_use'
// 图表
import Viser from 'viser-vue'

// ext library
import VueClipboard from 'vue-clipboard2'
import PageLoading from '@/components/Tool/PageLoading'
import './directives/permission'

VueClipboard.config.autoSetContainer = true

Vue.use(Viser)
Vue.use(PageLoading)
Vue.use(VueStorage, config.storageOptions)
Vue.use(VueClipboard)
