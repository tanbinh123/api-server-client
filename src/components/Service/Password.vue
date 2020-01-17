<template>
  <a-form-item
    v-bind="showLabel?formLayout:false"
    :label="showLabel?inputName:false"
  >
    <a-popover
      :placement="placement"
      :trigger="['focus']"
      v-model="state.passwordLevelChecked">
      <template slot="content">
        <div :style="{ width: '240px' }" >
          <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
          <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
          <div style="margin-top: 10px;">
            <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
          </div>
        </div>
      </template>
      <a-input-password
        :size="inputSize"
        autocomplete="false"
        :placeholder="`请输入${inputName}`"
        @click="handlePasswordInputClick"
        v-decorator="[inputId,{ rules: [{ required: true, message: '输入新密码!' },{ validator: this.handlePasswordLevel }],
                                validateTrigger: ['change', 'blur'], validateFirst: true}]">
        <a-icon v-if="inputPrefixIcon" slot="prefix" :type="inputPrefixIcon" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input-password>
    </a-popover>
  </a-form-item>
</template>

<script>
// 带提示密码强度的密码输入框
import { mixinDevice } from '@/utils/mixin.js'
const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'PasswordLevel',
  mixins: [mixinDevice],
  props: {
    inputId: {
      type: String,
      default: 'password'
    },
    inputName: {
      type: String,
      default: '密码'
    },
    inputSize: {
      type: String,
      default: 'default'
    },
    inputPrefixIcon: {
      type: String,
      default: ''
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    formLayout: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      state: {
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      placement: 'rightTop'
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    handlePasswordLevel (rule, value, callback) {
      let level = 0
      if (value.length < 6) {
        callback(new Error('密码不能少于6个字符'))
        return
      }
      if (value.length > 20) {
        callback(new Error('密码不能多于20个字符'))
        return
      }
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },
    handlePasswordInputClick () {
      if (this.isMobile()) {
        this.placement = 'bottom'
      }
      this.state.passwordLevelChecked = true
    }
  }
}
</script>

<style scoped>

</style>
