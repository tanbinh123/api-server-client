<template>
  <div class="main">
    <a-form
      ref="formReset"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert v-if="errorMsg" type="error" showIcon style="margin-bottom: 24px;" :message="errorMsg" />
      <a-form-item style="text-align: center">
        <a-radio-group v-model="type" buttonStyle="solid">
          <a-radio-button value="phone">手机号</a-radio-button>
          <a-radio-button value="email">电子邮箱</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item v-if="type === 'phone'">
        <a-input
          size="large"
          placeholder="手机号"
          v-decorator="['phone',{validateFirst: true,rules: [{ required: true, message: '请输入手机号' },
                                                             {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入格式正确的手机号'}], validateTrigger: 'blur'}]"
        >
          <a-icon slot="prefix" type="phone" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item v-if="type === 'email'">
        <a-input
          size="large"
          placeholder="邮箱"
          v-decorator="['email',{validateFirst: true,rules: [{ required: true, message: '请输入邮箱' },
                                                             {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入格式正确的邮箱地址'}], validateTrigger: 'blur'}]"
        >
          <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="验证码"
              v-decorator="['code', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a-button
            class="sendCodeBtn"
            size="large"
            :disabled="smsSendBtnState"
            @click.stop.prevent="getCode"
            v-text="!smsSendBtnState && '获取验证码'||(time+' s')"></a-button>
        </a-col>
      </a-row>
      <password inputId="password" :showLabel="false" inputPrefixIcon="lock" inputSize="large"/>
      <a-form-item>
        <a-input-password
          size="large"
          type="password"
          autocomplete="false"
          placeholder="确认密码"
          v-decorator="['confirmPassword',{validateFirst: true, rules: [{ required: true, message: '请输入确认密码' },
                                                                        {validator: handleConfirmPassword}],
                                           validateTrigger: ['change', 'blur']} ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="yesBtn"
          :loading="resetBtnState"
          :disabled="resetBtnState"
        >确定</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
import { sendEmailCode, sendPhoneCode, resetPwd } from '@/api/account'
import Password from '@/components/Service/Password'
export default {
  name: 'ResetPwd',
  components: {
    Password
  },
  data () {
    return {
      form: this.$form.createForm(this),
      errorMsg: '',
      type: 'phone',
      resetBtnState: false,
      time: 60,
      smsSendBtnState: false
    }
  },
  created () {
  },
  methods: {
    handleConfirmPassword (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      if (password && password !== value) {
        callback(new Error('确认密码和密码输入不一致'))
      } else {
        callback()
      }
    },
    getCode (e) {
      e.preventDefault()
      this.form.validateFields(['phone', 'email'], { force: true }, (err, values) => {
        if (!err) {
          this.smsSendBtnState = true
          // 计数器
          const interval = window.setInterval(() => {
            if (this.time-- <= 0) {
              this.time = 60
              this.smsSendBtnState = false
              window.clearInterval(interval)
            }
          }, 1000)
          let p
          if (this.type === 'email') {
            p = sendEmailCode(values.email)
          } else if (this.type === 'phone') {
            p = sendPhoneCode(values.phone)
          }

          p.then(res => {
            if (!res.status) {
              clearInterval(interval)
              this.time = 60
              this.smsSendBtnState = false
            }
          }).catch(err => {
            clearInterval(interval)
            this.time = 60
            this.smsSendBtnState = false
            console.error(err)
          })
        }
      }
      )
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.resetBtnState = true
          const params = {}
          params.account = this.type === 'email' ? values.email : values.phone
          params.password = values.password
          params.code = values.code
          resetPwd(params).then(res => {
            if (res.status) {
              setTimeout(() => {
                this.$router.push({ name: 'Login' })
              }, 2000)
            }
          }).finally(() => {
            this.resetBtnState = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .sendCodeBtn {
    display: block;
    width: 100%;
    height: 40px;
  }
  button.yesBtn {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
</style>
