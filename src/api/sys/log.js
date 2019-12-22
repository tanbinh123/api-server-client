import { axios } from '@/utils/request'

const api = {
  list: '/sys/log/list',
  remove: '/sys/log/batch-remove'
}

// 列表数据
export function list (data) {
  return axios({
    url: api.list,
    method: 'post',
    data: data
  })
}

// 删除
export function remove (ids) {
  return axios({
    url: `${api.remove}`,
    method: 'post',
    data: ids
  })
}
