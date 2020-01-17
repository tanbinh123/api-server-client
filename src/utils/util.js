import store from '@/store'
// 登录后欢迎提示
export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

// 系统登录后欢迎信息
export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

// 触发 window.resize
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0
  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

// 判断是否IE浏览器
export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

// 移除加载遮罩
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

// 判断变量是否为空
export function isEmpty (str) {
  if (str === undefined || str === null || str.trim() === '') {
    return true
  }
  return false
}
// 判断变量是否不为空
export function notEmpty (str) {
  return !isEmpty(str)
}

// 返回对象 不为空字段组成的对象，对象只能有一层
export function filterObj (obj = {}) {
  const ret = {}
  for (const key in obj) {
    if (notEmpty(obj[key])) {
      ret[key] = obj[key]
    }
  }
  return ret
}

// 将对象的字段 设置为空字符串, 对象只能有一层
export function clearObj (obj, fields) {
  (fields || Object.keys(obj)).map(key => {
    obj[key] = ''
  })
}

// modal 表单垂直布局, 通用配置
export const modalForm = () => {
  return {
    // model 弹窗标题
    title: '',
    // modal模式， 自定义
    mode: '',
    // 是否可见
    visible: false,
    formItemLayout: {
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 19 } }
    },
    confirmLoading: false,
    form: {}
  }
}

//  过滤掉数组中的空值
export function filterEmpty (children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

//  获取字符串长度，英文字符 长度1，中文字符长度2
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

// 截取字符串，根据 maxLength 截取后返回
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}

/**
 * 判断用户是否 拥有 value 任一权限
 */
export const checkPermission = (value) => {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters.permissions

    const hasPermission = permissions.some(role => {
      return value.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    return false
  }
}
