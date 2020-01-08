import Vue from 'vue'
import { login, getInfo, unReadCount } from '@/api/account'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import _omit from 'lodash/omit'

const user = {
  state: {
    token: '',
    username: '',
    welcome: '',
    avatar: '',
    roles: [],
    resources: [],
    userInfo: {},
    unreadCount: 0 // 未读消息数量
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, { username, welcome }) => {
      state.username = username
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_RESOURCES: (state, resources) => {
      state.resources = resources
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_UNREAD_COUNT: (state, count) => {
      state.unreadCount = count
    }
  },

  actions: {
    // 登录
    Login ({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        login(loginInfo).then(res => {
          if (res.status) {
            // 登录成功
            Vue.ls.set(ACCESS_TOKEN, res.data.token, res.data.expireIdle * 60 * 60 * 1000)
            commit('SET_TOKEN', res.data.token)
          }
          resolve(res)
        }).catch(error => {
          // 网络异常
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          const roles = [...data.roles]
          const resources = [...data.resources]

          // 设置 角色代码、资源代码
          commit('SET_ROLES', roles)
          commit('SET_RESOURCES', resources)

          // 设置用户信息
          let info = {}
          Object.assign(info, data)
          info = _omit(info, ['roles', 'resources'])
          // console.log('omit info' + JSON.stringify(info))
          commit('SET_USERINFO', info)

          // 设置其它信息
          commit('SET_USERNAME', { username: data.username, welcome: welcome() })
          commit('SET_AVATAR', data.avatar)

          // console.log(JSON.stringify(data))
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_RESOURCES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove('loginParams')
        resolve()
      })
    },
    // 未读消息数量
    getUnreadCount ({ commit }) {
      return new Promise((resolve, reject) => {
        console.log('load unread msg count at ' + new Date().toLocaleTimeString())
        unReadCount().then(response => {
          if (!response.status) {
            console.log('获取未读消息数量异常')
          }
          commit('SET_UNREAD_COUNT', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
