<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="20">
        <a-form :form="form" >
          <a-form-item
            v-bind="formLayout"
            label="姓名"
          >
            <a-input
              v-decorator="['nickname',{ rules: [{ required: true, message: '请输入姓名!' }]}]"
              placeholder="给自己起个名字" />
          </a-form-item>
          <a-form-item
            v-bind="formLayout"
            label="头像"
          >
            <a-upload
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="`${fileServer}/file/upload`"
              :beforeUpload="handleBeforeUpload"
              @change="handleUploadChange"
            >
              <a-tooltip placement="right" title="点击上传">
                <img v-if="avatar!==''" :src="`${this.fileServer}/${this.avatar}`" width="100px" alt="头像" />
                <div v-else>
                  <a-icon :type="avatarLoading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-tooltip>
            </a-upload>
          </a-form-item>
          <a-form-item
            v-bind="formLayout"
            label="简介"
          >
            <a-textarea
              v-decorator="['intro' ]"
              rows="4"
              placeholder="You are not alone."/>
          </a-form-item>
          <a-form-item
            label="手机"
            v-bind="formLayout"
          >
            <a-input
              v-decorator="['phone',{validateFirst: true, rules: [{ required: true, message: '请输入电话号码!' },
                                              {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入格式正确的手机号'}
              ]} ]"
              placeholder="15238002477"/>
          </a-form-item>
          <a-form-item
            label="电子邮件"
            v-bind="formLayout"
          >
            <a-input
              v-decorator="['email',{validateFirst: true, rules: [{ required: true, message: '请输入电子邮箱地址!' },
                                              {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入格式正确的邮箱地址'}
              ]} ]"
              placeholder="exp@admin.com"/>
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
import { updateUserInfo } from '@/api/account'
import store from '@/store'
export default {
  name: 'Info',
  data () {
    return {
      form: this.$form.createForm(this),
      formLayout: {
        labelCol: { xs: { span: 24 }, sm: { span: 4 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 19 } }
      },
      avatarLoading: false,
      btnLoading: false,
      avatar: ''
    }
  },
  created () {
    this.initUserInfo()
  },
  methods: {
    initUserInfo () {
      const info = this.$store.getters.userInfo
      this.avatar = info.avatar
      this.$nextTick(() => {
        this.form.setFieldsValue({
          nickname: info.nickname,
          phone: info.phone,
          email: info.email,
          intro: info.intro
        })
      })
    },
    handleUploadChange (info) {
      if (info.file.status === 'uploading') {
        this.avatarLoading = true
        this.avatar = ''
        return
      }
      if (info.file.status === 'done') {
        setTimeout(() => {
          this.avatarLoading = false
          if (info.file.response.status) {
            this.avatar = info.file.response.data
          }
        }, 100)
      }
    },
    handleBeforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error('仅能上传  JPG/PNG 文件!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传文件必须小于 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    handleBtnClick () {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.avatar = this.avatar
          this.btnLoading = true
          updateUserInfo(values).then(result => {
            if (result.status) {
              store.dispatch('GetInfo').then(ret => {
                // ret.status && this.initUserInfo()
              }).catch(() => {})
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

<style lang="less" scoped>
</style>
