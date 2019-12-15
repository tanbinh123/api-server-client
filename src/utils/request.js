import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { notification, message } from 'ant-design-vue'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000
})

// 退出操作
const logout = () => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    store.dispatch('Logout').then(() => {
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    })
  }
}

// 刷新权限
const refreshApp = () => {
  setTimeout(() => {
    window.location.reload()
  }, 1500)
}

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    notification.error({
      message: error.response.status,
      description: data.message
    })
  }
  console.error(error)
  return Promise.reject(error)
}

service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ACCESS_TOKEN] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

service.interceptors.response.use((response) => {
  console.log('------------------------- 响应数据 -------------------------------')
  console.table(JSON.stringify(response.data))
  console.log('------------------------------------------------------------------')
  const { status, msg, code } = response.data

  // 数据响应、操作成功响应
  if (status) {
    msg && message.success(msg)
  } else {
    if ([2000, 2001].includes(code)) {
      // api系统异常
      msg && notification.error({
        message: 'Error',
        description: msg
      })
    } else {
      // 失败提示信息
      msg && message.error(msg)
    }

    if ([2006].includes(code)) {
      // 无权限
      refreshApp()
    }

    if ([2005].includes(code)) {
      // 未登录 直接访问资源
      logout()
    }
  }
  // 返回了完整结构的数据
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
