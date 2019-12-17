<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="20">
        <a-form :form="form" >
          <a-form-item
            v-bind="formLayout"
            label="原密码"
          >
            <a-input-password
              v-decorator="['oldPwd',{ rules: [{ required: true, message: '请输入姓名!' }]}]"
              placeholder="输入原密码" />
          </a-form-item>
          <a-form-item
            v-bind="formLayout"
            label="新密码"
          >
            <a-input-password
              name="newPwd"
              v-decorator="['newPwd',{ rules: [{ required: true, message: '输入新密码!' },
                                               {pattern: /^[\w]{6,10}$/, message: '密码格式 必须位 6-15位数字或字母'},
                                               {validator: handleNewPwd}], validateFirst: true}]"
              placeholder="输入新密码" />
          </a-form-item>
          <a-form-item
            v-bind="formLayout"
            label="确认密码"
          >
            <a-input-password
              name="confirmNewPwd"
              v-decorator="['confirmNewPwd',{ rules: [{ required: true, message: '输入确认密码!' },
                                                      {pattern: /^[\w]{6,10}$/, message: '密码格式 必须位 6-15位数字或字母'},
                                                      {validator: handleConfirmNewPwd}], validateFirst: true}]"
              placeholder="输入确认密码" />
          </a-form-item>
          <a-form-item>
            <a-row>
              <a-col :xs="24" :sm="4"></a-col>
              <a-col :xs="24" :sm="19"><a-button type="primary" :loading="btnLoading" @click="handleBtnClick">保存</a-button></a-col>
            </a-row>
          </a-form-item>
        </a-form>

      </a-col>
    </a-row>
  </div>
</template>

<script>
import { changePwd } from '@/api/account'
export default {
  name: 'Pwd',
  data () {
    return {
      form: this.$form.createForm(this),
      formLayout: {
        labelCol: { xs: { span: 24 }, sm: { span: 4 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 15 } }
      },
      btnLoading: false
    }
  },
  methods: {
    handleNewPwd (rule, value, callback) {
      const confirmNewPwd = this.form.getFieldValue('confirmNewPwd')
      if (confirmNewPwd && confirmNewPwd !== value) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    },
    handleConfirmNewPwd (rule, value, callback) {
      const newPwd = this.form.getFieldValue('newPwd')
      if (newPwd && newPwd !== value) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    },
    handleBtnClick () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.btnLoading = true
          changePwd({ newPwd: values.newPwd, oldPwd: values.oldPwd }).then(result => {
            if (result.status) {
              setTimeout(() => {
                this.form.resetFields()
              }, 1000)
            }
          }).finally(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
