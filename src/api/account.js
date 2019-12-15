import { axios } from '@/utils/request'

const api = {
  login: '/account/login',
  getUserInfo: '/account/user-info',
  updateUserInfo: '/account/update-user-info',
  changePwd: '/account/change-password',
  listLog: '/account/list-log'
}
export function login (data) {
  return axios({
    url: api.login,
    method: 'post',
    data: data
  })
}
/**
 * 获取用户信息
 * @returns {*}
 */
export function getInfo () {
  return axios({
    url: api.getUserInfo,
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo (data) {
  return axios({
    url: api.updateUserInfo,
    method: 'post',
    data: data
  })
}

// 更新密码
export function changePwd (data) {
  return axios({
    url: api.changePwd,
    method: 'post',
    data: data
  })
}

// 列表数据
export function listLog (data) {
  return axios({
    url: api.listLog,
    method: 'post',
    data: data
  })
}
