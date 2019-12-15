import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import '@/components/NProgress/nprogress.less'
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false })
const whiteList = ['Login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  // 白名单
  if (whiteList.includes(to.name) || to.path === '/login') {
    next()
    NProgress.done()
    return
  }
  // 未登录
  if (!Vue.ls.get(ACCESS_TOKEN)) {
    console.log('未登录')
    next({ path: '/login', query: { redirect: to.fullPath } })
    NProgress.done()
    return
  }
  // 已经获取权限信息
  if (store.getters.roles.length !== 0) {
    next()
    NProgress.done()
    return
  }
  // 未获取权限信息
  console.log('-- 获取用户信息（包含角色权限) --')
  store.dispatch('GetInfo')
    .then(res => {
      store.dispatch('GenerateRoutes', res).then(() => {
        router.addRoutes(store.getters.addRouters) // 添加根据角色等生成的路由表
        const redirect = decodeURIComponent(from.query.redirect || to.path)
        if (to.path === redirect) {
          next({ ...to, replace: true })
        } else {
          next({ path: redirect })
        }
      })
    })
    .catch(() => {
      notification.error({ message: '错误', description: '请求用户信息失败，请重试' })
      store.dispatch('Logout').then(() => {
        next({ path: '/login', query: { redirect: to.fullPath } })
      })
    })
})

router.afterEach(() => {
  NProgress.done()
})
