<template>
  <a-form-item
    :label="itemLabel"
    v-bind="formItemLayout"
  >
    <a-upload
      name="file"
      accept="image/*"
      :headers="uploadHeaders"
      listType="picture-card"
      class="avatar-uploader"
      :showUploadList="false"
      v-decorator="['imgFile',{ rules: [{required:mustUpload, validator: fileRequiredValidator }]}]"
      :action="`${fileServer}/file/upload`"
      :beforeUpload="handleBeforeUpload"
      @change="handleUploadChange"
    >
      <img v-if="imgPath" :src="`${this.fileServer}/${imgPath}`" :style="{ width: '100%' }" alt="upload image"/>
      <div v-else>
        <a-icon :type="loading? 'loading' : 'plus'"/>
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
  </a-form-item>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'ImgUpload',
  data () {
    return {
      // 此处仅 子组件 ui控制
      uploadHeaders: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      loading: false
    }
  },
  activated () {
    console.log('activated')
  },
  props: {
    mustUpload: {
      type: Boolean,
      default: true
    },
    itemLabel: {
      type: String,
      default: '图片'
    },
    imgPath: {
      type: String,
      default: ''
    },
    formItemLayout: {
      type: Object,
      default: () => {
        return {
          labelCol: { xs: { span: 24 }, sm: { span: 6 } },
          wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        }
      }
    }
  },
  methods: {
    fileRequiredValidator (rule, value, callback) {
      if (this.mustUpload) {
        // 给 父组件 刷新数据 到子组件留时间
        this.$nextTick(() => {
          if (this.loading || this.imgPath) {
            callback()
          } else {
            callback(new Error('请选择图片上传'))
          }
        })
      } else {
        callback()
      }
    },
    handleUploadChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        this.$emit('update:imgPath', '')
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response.status) {
          this.$emit('update:imgPath', info.file.response.data)
        }
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
    }
  }
}
</script>

<style scoped>

</style>
