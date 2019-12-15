import { axios } from '@/utils/request'

const api = {
  list: '/sys/role/list',
  add: '/sys/role/add',
  update: '/sys/role/update',
  remove: '/sys/role/remove',
  toggleState: '/sys/role/toggle-state',
  detail: '/sys/role/detail',
  listNoResources: '/sys/role/list-no-resources',
  listHaveResources: '/sys/role/list-have-resources',
  addRoleResources: '/sys/role/add-role-resources',
  delRoleResources: '/sys/role/del-role-resources'
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

/**
 * 角色未拥有资源列表
 * @param roleId
 * @param data
 * @returns {*}
 */
export function listNoResources (roleId, data) {
  return axios({
    url: `${api.listNoResources}/${roleId}`,
    method: 'post',
    data: data
  })
}

/**
 * 角色已拥有资源列表
 * @param roleId
 * @param data
 * @returns {*}
 */
export function listHaveResources (roleId, data) {
  return axios({
    url: `${api.listHaveResources}/${roleId}`,
    method: 'post',
    data: data
  })
}

/**
 * 角色添加资源
 * @param roleId
 * @param data
 * @returns {*}
 */
export function addRoleResources (roleId, data) {
  return axios({
    url: `${api.addRoleResources}/${roleId}`,
    method: 'post',
    data: data
  })
}

/**
 * 角色删除资源
 * @param roleId
 * @param data
 * @returns {*}
 */
export function delRoleResources (roleId, data) {
  return axios({
    url: `${api.delRoleResources}/${roleId}`,
    method: 'post',
    data: data
  })
}
