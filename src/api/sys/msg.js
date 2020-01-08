import { axios } from '@/utils/request'

const api = {
  unreadCount: '/sys/msg/unread-count',
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
export function unReadCount () {
  return axios({
    url: api.unreadCount,
    method: 'get'
  })
}
