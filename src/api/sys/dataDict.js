import { axios } from '@/utils/request'

const api = {
  list: '/sys/data-dict/list',
  listTreeData: '/sys/data-dict/list-tree-select',
  add: '/sys/data-dict/add',
  update: '/sys/data-dict/update',
  remove: '/sys/data-dict/remove',
  toggleState: '/sys/data-dict/toggle-state'
}

// 列表数据
export function list (data) {
  return axios({
    url: api.list,
    method: 'post',
    data: data
  })
}

export function listTreeData (currentKey) {
  const uri = currentKey ? `${api.listTreeData}/${currentKey}` : api.listTreeData
  return axios({
    url: uri,
    method: 'get'
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
