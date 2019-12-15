import { axios } from '@/utils/request'

const api = {
  list: '/sys/user/list',
  add: '/sys/user/add',
  update: '/sys/user/update',
  remove: '/sys/user/remove',
  toggleState: '/sys/user/toggle-state',
  resetPwd: '/sys/user/reset-pwd',
  listNoRoles: '/sys/user/list-no-roles',
  listHaveRoles: '/sys/user/list-have-roles',
  addUserRoles: '/sys/user/add-user-roles',
  delUserRoles: '/sys/user/del-user-roles',
  detail: '/sys/user/detail'
}

// 列表数据
export function list (data) {
  return axios({
    url: api.list,
    method: 'post',
    data: data
  })
}

// 新增
export function add (data) {
  return axios({
    url: api.add,
    method: 'post',
    data: data
  })
}

// 编辑
export function update (id, data) {
  return axios({
    url: `${api.update}/${id}`,
    method: 'post',
    data: data
  })
}
// 删除
export function remove (id) {
  return axios({
    url: `${api.remove}/${id}`,
    method: 'get'
  })
}

// 切换状态
export function toggleState (id) {
  return axios({
    url: `${api.toggleState}/${id}`,
    method: 'get'
  })
}

// 切换状态
export function resetPwd (id) {
  return axios({
    url: `${api.resetPwd}/${id}`,
    method: 'get'
  })
}

/**
 * 用户无角色列表
 * @param userId
 * @param data
 * @returns {*}
 */
export function listNoRoles (userId, data) {
  return axios({
    url: `${api.listNoRoles}/${userId}`,
    method: 'post',
    data: data
  })
}

/**
 * 用户有角色列表
 * @param userId
 * @param data
 * @returns {*}
 */
export function listHaveRoles (userId, data) {
  return axios({
    url: `${api.listHaveRoles}/${userId}`,
    method: 'post',
    data: data
  })
}

/**
 * 用户添加角色
 * @param userId
 * @param data
 * @returns {*}
 */
export function addUserRoles (userId, data) {
  return axios({
    url: `${api.addUserRoles}/${userId}`,
    method: 'post',
    data: data
  })
}

/**
 * 用户添加角色
 * @param userId
 * @param data
 * @returns {*}
 */
export function delUserRoles (userId, data) {
  return axios({
    url: `${api.delUserRoles}/${userId}`,
    method: 'post',
    data: data
  })
}

/**
 * 详情
 * @param id
 * @returns {*}
 */
export function detail (id) {
  return axios({
    url: `${api.detail}/${id}`,
    method: 'get'
  })
}
