<template>
  <div>
    <a-card v-if="$route.name === 'User'" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="query.search_LIKE_id" placeholder="请输入用户名"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="简介">
                <a-input v-model="query.search_LIKE_intro" placeholder="请输入描述"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="手机号">
                  <a-input v-model="query.search_LIKE_phone" placeholder="请输入手机号"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="邮箱">
                  <a-input v-model="query.search_LIKE_email" placeholder="请输入邮箱"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 6 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button v-action:sysRole:add type="primary" @click="handleAdd">  <a-icon type="plus" />新增</a-button>
      </div>
      <a-table
        :bordered="false"
        :columns="columns"
        :loading="loading"
        :defaultExpandAllRows="true"
        :dataSource="data"
        :pagination="pagination"
        @change="handleChange"
        :rowKey="record => record.id" >
        <template slot="avatar" slot-scope="avatar">
          <a-avatar :src="`${fileServer}/${avatar}`"/>
        </template>
        <template slot="state" slot-scope="state">
          <a-badge v-if="state === '0'" status="success" />
          <a-badge v-else status="error" />
        </template>
        <template slot="action" slot-scope="record">
          <div class="editable-row-operations">
            <a-tooltip v-action:sysUser:toggle :title=" record.state==='0'?'启用':'禁用' ">
              <a-switch :size="rowBtnSize" :checked="record.state === '0'" @change="toggleState(record)" />
            </a-tooltip>
            <a-button class="rowBtn" :size="rowBtnSize" type="link" v-action:sysUser:update @click="handleEdit(record)">编辑</a-button>
            <a-button
              class="rowBtn"
              type="link"
              :size="rowBtnSize"
              v-action:sysUser:configRoles
              @click="handleConfigRoles(record.id)">配置角色</a-button>
            <a-popconfirm
              v-action:sysUser:resetPwd
              placement="top"
              title="确定重置此用户密码吗？"
              trigger="hover"
              @confirm="handleResetPwd(record.id)"
              okText="是"
              cancelText="否"
            >
              <a-button
                class="rowBtn"
                type="link"
                :size="rowBtnSize"
              >重置密码</a-button>
            </a-popconfirm>
            <a-popconfirm
              v-action:sysUser:remove
              placement="top"
              title="确定删除此数据吗？"
              trigger="hover"
              @confirm="handleRemove(record.id)"
              okText="是"
              cancelText="否"
            >
              <a-button
                class="rowBtn"
                type="link"
                :size="rowBtnSize">删除</a-button>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
      <a-modal
        :visible="modal.visible"
        :title="modal.title"
        :confirmLoading="modal.confirmLoading"
        @cancel="handleModalCancel"
        @ok="handleModalOk"
      >
        <a-form
          :form="form"
        >
          <a-form-item
            label="用户名"
            v-bind="modal.formItemLayout"
          >
            <a-input
              :disabled="modal.mode === 'edit'"
              v-decorator="['id',{ rules: [{ required: true, message: '请输入用户名!' }]} ]"
            />
          </a-form-item>
          <a-form-item
            label="头像"
            v-bind="modal.formItemLayout">
            <a-upload
              name="file"
              accept="image/*"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="`${fileServer}/file/upload`"
              :beforeUpload="handleBeforeUpload"
              @change="handleUploadChange"
            >
              <img v-if="modal.form.avatarUrl" :src="modal.form.avatarUrl" width="100px" alt="avatar" />
              <div v-else>
                <a-icon :type="modal.form.avatarLoading? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item
            label="手机号"
            v-bind="modal.formItemLayout"
          >
            <a-input
              v-decorator="['phone',{ rules: [{ required: true, message: '请输入手机号!' }]} ]"
            />
          </a-form-item>
          <a-form-item
            label="邮箱"
            v-bind="modal.formItemLayout"
          >
            <a-input
              v-decorator="['email',{ rules: [{ required: true, message: '请输入邮箱!' }]} ]"
            />
          </a-form-item>
          <a-form-item
            label="状态"
            v-bind="modal.formItemLayout"
          >
            <a-radio-group v-decorator="['state',{ rules: [{ required: true, message: '请选择状态!' }]} ]" >
              <a-radio value="0">启用</a-radio>
              <a-radio value="1">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="简介"
            v-bind="modal.formItemLayout"
          >
            <a-input
              type="textarea"
              v-decorator="['intro']"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
    <transition name="page-transition">
      <router-view />
    </transition>
  </div>
</template>
<script>
import { list, add, update, toggleState, remove, resetPwd } from '@/api/sys/user'
import { noEmptyFieldsObj, modalFormSetting } from '@/utils/util.curd'
const modalSetting = modalFormSetting()
modalSetting.form.avatar = ''
modalSetting.form.avatarUrl = null
modalSetting.form.avatarLoading = false
export default {
  name: 'User',
  data () {
    return {
      description: '',
      form: this.$form.createForm(this),
      rowBtnSize: 'small',
      loading: false,
      columns: [
        { title: '状态', dataIndex: 'state', align: 'center', scopedSlots: { customRender: 'state' } },
        { title: '头像', dataIndex: 'avatar', align: 'center', scopedSlots: { customRender: 'avatar' } },
        { title: '用户名', dataIndex: 'id' },
        { title: '昵称', dataIndex: 'nickname' },
        { title: '简介', dataIndex: 'intro' },
        { title: '电话', dataIndex: 'phone', align: 'left' },
        { title: '邮箱', dataIndex: 'email', align: 'left' },
        { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
      ],
      data: [],
      advanced: false,
      query: {
        search_LIKE_id: '',
        search_LIKE_intro: '',
        search_LIKE_phone: '',
        search_LIKE_email: ''
      },
      pagination: {
        showSizeChanger: true,
        total: 0,
        current: 1,
        pageSize: 10
      },
      modal: modalSetting
    }
  },
  computed: {
    filter () {
      return noEmptyFieldsObj(this.query)
    }
  },
  watch: {
    $route (to, from) {
      console.log('User 页面监听到 子路由变化')
      // 子路由description 无法更新到 PageView, 所以手动控制
      if (to.name === 'UserConfigRoles') {
        this.description = `左侧为 用户 ${to.params.userId} 未拥有角色，右侧为已拥有角色`
      }
      if (to.name === 'User') {
        this.description = ''
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.loading = true
      const body = {
        filter: this.filter,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      list(body).then((result) => {
        this.data = result.data.records
        this.pagination.current = result.data.current
        this.pagination.total = result.data.total
        this.pagination.pageSize = result.data.pageSize
      }).finally(() => {
        this.loading = false
      })
    },
    handleUploadChange (info) {
      if (info.file.status === 'uploading') {
        this.modal.form.avatarLoading = true
        this.modal.form.avatarUrl = null
        return
      }
      if (info.file.status === 'done') {
        setTimeout(() => {
          this.modal.form.avatarLoading = false
          if (info.file.response.status) {
            this.modal.form.avatarUrl = `${this.fileServer}/${info.file.response.data}`
            this.modal.form.avatar = info.file.response.data
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
    handleSearch () {
      this.pagination.current = 1
      this.pagination.total = 0
      this.loadData()
    },
    handleChange (pagination) {
      this.pagination = pagination
      this.loadData()
    },
    toggleState (record) {
      toggleState(record.id).then(result => {
        result.status && this.loadData()
      })
    },
    handleAdd () {
      this.modal.title = '新增用户'
      this.modal.mode = 'add'
      this.modal.visible = true
      // 表单头像数据置空
      this.modal.form.avatar = ''
      this.modal.form.avatarUrl = null
      this.modal.form.avatarLoading = false
      // 设置默认字段
      this.$nextTick(() => {
        this.form.setFieldsValue({
          state: '0'
        })
      })
    },
    handleEdit (record) {
      this.modal.title = '编辑用户'
      this.modal.mode = 'edit'
      this.modal.visible = true
      // 加载用户头像
      this.modal.form.avatar = record.avatar
      this.modal.form.avatarUrl = `${this.fileServer}/${record.avatar}`
      this.modal.form.avatarLoading = false
      // 加载用户表单
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id,
          phone: record.phone,
          email: record.email,
          state: record.state,
          intro: record.intro
        })
      })
    },
    handleConfigRoles (id) {
      this.$router.push({ name: 'UserConfigRoles', params: { userId: id } })
    },
    handleResetPwd (id) {
      resetPwd(id).then(result => {
        result.status && this.loadData()
      })
    },
    handleRemove (id) {
      remove(id).then(result => {
        result.status && this.loadData()
      })
    },
    handleModalOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('form: ', values)
          this.modal.confirmLoading = true
          // 选中的角色
          values.avatar = this.modal.form.avatar
          if (this.modal.mode === 'add') {
            add(values).then(this.handleModalOkResult)
          } else if (this.modal.mode === 'edit') {
            update(values.id, values).then(this.handleModalOkResult)
          }
        }
      })
    },
    handleModalOkResult (result) {
      this.modal.confirmLoading = false
      if (result.status) {
        this.modal.visible = false
        this.form.resetFields()
        this.loadData()
      }
    },
    handleModalCancel () {
      this.form.resetFields()
      this.modal.visible = false
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
