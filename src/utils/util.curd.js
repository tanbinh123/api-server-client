
/**
 * 是否为空
 * @param str
 */
export function isEmpty (str) {
  if (str === undefined || str === null || str.trim() === '') {
    return true
  }
  return false
}

/**
 * 是否不为空
 * @param str
 * @returns {boolean}
 */
export function notEmpty (str) {
  return !isEmpty(str)
}

/**
 * 返回 对象不为空的 字段组成的对象
 * @param obj
 */
export function noEmptyFieldsObj (obj) {
  const ret = {}
  for (const key in obj) {
    if (notEmpty(obj[key])) {
      ret[key] = obj[key]
    }
  }
  return ret
}

/**
 * 将对象指定字段设置为空字符串
 * @param obj 对象
 * @param fields 字段集合
 */
export function clearObjFields (obj, fields) {
  (fields || Object.keys(obj)).map(key => {
    obj[key] = ''
  })
}

// modal 表单垂直布局, 通用配置
export const modalFormSetting = () => {
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
