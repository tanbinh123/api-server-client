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
          <password inputId="newPwd" :formLayout="formLayout"/>
          <a-form-item
            v-bind="formLayout"
            label="确认密码"
          >
            <a-input-password
              name="confirmNewPwd"
              v-decorator="['confirmNewPwd',{ rules: [{ required: true, message: '输入确认密码!' },
                                                      {validator: handleConfirmNewPwd}], validateTrigger: ['change', 'blur'], validateFirst: true}]"
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
import Password from '@/views/components/Password'
export default {
  name: 'Pwd',
  components: {
    Password
  },
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
    handleConfirmNewPwd (rule, value, callback) {
      const newPwd = this.form.getFieldValue('newPwd')
      if (newPwd && newPwd !== value) {
        callback(new Error('确认密码和新密码输入不一致'))
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
