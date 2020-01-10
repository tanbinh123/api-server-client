<template>
  <div>
    <keep-alive>
      <!--跳转到子路由 缓存父组件-->
      <a-card v-if="$route.name === 'User'" :bordered="false">
        <search-form :searchFields="searchFields" @search="handleSearchEvent"/>
        <div class="table-operator">
          <a-button v-action:sysUser:add type="primary" icon="plus" @click="handleAdd">新增</a-button>
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
            <div class="row-operations">
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
              label="状态"
              v-bind="modal.formItemLayout"
            >
              <a-radio-group v-decorator="['state',{ rules: [{ required: true, message: '请选择状态!' }]} ]" >
                <a-radio value="0">启用</a-radio>
                <a-radio value="1">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="姓名/昵称"
              v-bind="modal.formItemLayout"
            >
              <a-input v-decorator="['nickname']"/>
            </a-form-item>
            <avatar-upload :imgPath.sync="modal.form.avatar" itemLabel="头像" :formItemLayout="modal.formItemLayout"/>
            <a-form-item
              label="手机号"
              v-bind="modal.formItemLayout"
            >
              <a-input
                v-decorator="['phone']"
              />
            </a-form-item>
            <a-form-item
              label="邮箱"
              v-bind="modal.formItemLayout"
            >
              <a-input
                v-decorator="['email']"
              />
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
    </keep-alive>
    <transition name="page-transition">
      <router-view />
    </transition>
  </div>
</template>
<script>
import { list, add, update, toggleState, remove, resetPwd } from '@/api/sys/user'
import { modalFormSetting } from '@/utils/util.curd'
import AvatarUpload from '@/views/components/AvatarUpload'
import SearchForm from '@/views/components/SearchForm'
const modalSetting = modalFormSetting()
modalSetting.form.avatar = ''

export default {
  name: 'User',
  components: {
    SearchForm,
    AvatarUpload
  },
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
        { title: '操作', key: 'action', align: 'right', scopedSlots: { customRender: 'action' } }
      ],
      data: [],
      searchFields: [
        { name: '用户名', code: 'search_LIKE_id' },
        { name: '简介', code: 'search_LIKE_intro' },
        { name: '电话', code: 'search_LIKE_phone' },
        { name: '邮箱', code: 'search_LIKE_email' }
      ],
      pagination: {
        showSizeChanger: true,
        total: 0,
        current: 1,
        pageSize: 10
      },
      filter: {},
      modal: modalSetting
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
    handleSearchEvent (filter) {
      this.pagination.current = 1
      this.pagination.total = 0
      this.filter = filter
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
      this.modal.form.avatarLoading = false
      // 加载用户表单
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id,
          nickname: record.nickname,
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
          this.modal.confirmLoading = true
          delete values.imgFile
          values.avatar = this.modal.form.avatar
          console.log('form: ', values)
          if (this.modal.mode === 'add') {
            // axios 会自动过滤掉 undefined
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
    }
  }
}
</script>
