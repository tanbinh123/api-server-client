import { axios } from '@/utils/request'

const api = {
  login: '/account/login',
  getUserInfo: '/account/user-info',
  updateUserInfo: '/account/update-user-info',
  changePwd: '/account/change-password',
  listLog: '/account/list-log',
  sendEmailCode: '/account/send-email-code',
  sendPhoneCode: '/account/send-phone-code',
  resetPwd: '/account/reset-password',
  unreadCount: '/sys/msg/unread-count',
  msgUnread: '/sys/msg/list/0',
  readMsg: '/sys/msg/read',
  msgRead: '/sys/msg/list/1',
  delMsg: '/sys/msg/delete'
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

// 日志列表数据
export function listLog (data) {
  return axios({
    url: api.listLog,
    method: 'post',
    data: data
  })
}

// 发送邮件验证码
export function sendEmailCode (email) {
  return axios({
    url: `${api.sendEmailCode}/${email}`,
    method: 'get'
  })
}

// 发送手机验证码
export function sendPhoneCode (phone) {
  return axios({
    url: `${api.sendPhoneCode}/${phone}`,
    method: 'get'
  })
}

export function resetPwd (data) {
  return axios({
    url: api.resetPwd,
    method: 'post',
    data: data
  })
}

// 未读消息数量
export function unReadCount () {
  return axios({
    url: api.unreadCount,
    method: 'get'
  })
}

// 未读消息列表
export function listUnreadMsg (data) {
  return axios({
    url: api.msgUnread,
    method: 'post',
    data: data
  })
}

export function readMsg (id) {
  return axios({
    url: `${api.readMsg}/${id}`,
    method: 'get'
  })
}

// 已读消息列表
export function listReadMsg (data) {
  return axios({
    url: api.msgRead,
    method: 'post',
    data: data
  })
}

export function delMsg (id) {
  return axios({
    url: `${api.delMsg}/${id}`,
    method: 'get'
  })
}
