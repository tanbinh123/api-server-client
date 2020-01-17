<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert v-if="loginErrMsg" type="error" showIcon style="margin-bottom: 24px;" :message="loginErrMsg" />
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="账户"
          v-decorator="['username',{rules: [{ required: true, message: '请输入帐户名' }], validateTrigger: 'blur'}]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="密码"
          v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'} ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-checkbox :checked="rememberMe" @change="() => {rememberMe = !rememberMe}">记住账号(7天)</a-checkbox>
        <router-link :to="{name: 'ResetPwd'}" class="forge-password" style="float: right;" >忘记密码</router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'Login',
  data () {
    return {
      loginErrMsg: '',
      form: this.$form.createForm(this),
      rememberMe: false,
      state: {
        loginBtn: false
      }
    }
  },
  created () {
    const loginParams = Vue.ls.get('loginParams')
    if (loginParams) {
      this.$nextTick(() => {
        this.form.setFieldsValue(loginParams)
      })
      this.rememberMe = true
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'getUnreadCount']),
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields }, state, Login } = this
      state.loginBtn = true
      const validateFieldsKey = ['username', 'password']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = {}
          loginParams.username = values.username
          loginParams.password = values.password
          Login(loginParams)
            .then((res) => {
              if (!res.status) {
                this.loginErrMsg = res.msg
                Vue.ls.remove('loginParams')
                return
              }
              // 本地记住账号密码
              if (this.rememberMe) {
                Vue.ls.set('loginParams', loginParams, 7 * 24 * 60 * 60 * 1000)
              } else {
                Vue.ls.remove('loginParams')
              }
              if (Vue.ls.get(ACCESS_TOKEN)) {
                this.getUnreadCount()
              }
              this.loginErrMsg = ''
              this.$router.push({ path: '/' })
              setTimeout(() => {
                this.$notification.success({
                  message: '欢迎',
                  description: `${timeFix()}，欢迎回来`
                })
              }, 1000)
            })
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
  .forge-password {
    font-size: 14px;
  }
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
