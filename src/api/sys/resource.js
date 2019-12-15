import { axios } from '@/utils/request'

const api = {
  list: '/sys/resource/list',
  add: '/sys/resource/add',
  update: '/sys/resource/update',
  remove: '/sys/resource/remove',
  toggleState: '/sys/resource/toggle-state'
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
