import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

// 将整数部分逢三一断
Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return intPartFormat
})

// 日期格式化
Vue.filter('DateFormat', function (dateStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dateStr).format(pattern)
})

// 日期显示 （例如 星期一，上周一， 几月几号等）
Vue.filter('Calendar', function (dateStr) {
  return moment(dateStr).calendar()
})
