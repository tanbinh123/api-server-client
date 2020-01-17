<template>
  <div>
    <!-- 因为页面内有路由跳转到子页面，所以加keep-alive-->
    <keep-alive>
      <a-card v-if="$route.name === 'Role'" :bordered="false">
        <single-search-form :searchFields="searchFields" @search="handleSearchEvent">
          <template v-if="checkPermission(['sysRole:add'])" #head>
            <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
          </template>
        </single-search-form>
        <a-table
          :bordered="false"
          :columns="columns"
          :loading="loading"
          :size="tableSize"
          :dataSource="data"
          :pagination="pagination"
          @change="handleChange"
          :rowKey="record => record.id" >
          <template slot="state" slot-scope="state">
            <a-badge v-if="state === 'ON'" status="success" />
            <a-badge v-else status="error" />
          </template>
          <template slot="action" slot-scope="record">
            <div class="row-operations">
              <a-tooltip v-permission="['sysRole:toggle']" :title=" record.state==='ON'?'启用':'禁用' ">
                <a-switch size="small" :checked="record.state === 'ON'" @change="toggleState(record)" />
              </a-tooltip>
              <a-button
                v-permission="['sysRole:update']"
                class="rowBtn"
                type="link"
                size="small"
                @click="handleEdit(record)">编辑</a-button>
              <a-button
                v-permission="['sysRole:configResources']"
                class="rowBtn"
                type="link"
                size="small"
                @click="handleConfigResources(record.id)">配置资源</a-button>
              <a-popconfirm
                v-permission="['sysRole:remove']"
                placement="top"
                title="你确定要删除这条数据吗?"
                trigger="hover"
                @confirm="handleRemove(record.id)"
                okText="是"
                cancelText="否"
              >
                <a-button
                  class="rowBtn"
                  type="link"
                  size="small">删除</a-button>
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
              label="角色名"
              v-bind="modal.formItemLayout"
            >
              <a-input
                v-decorator="['name',{ rules: [{ required: true, message: '请输入角色名!' }]} ]"
              />
            </a-form-item>
            <a-form-item
              label="编码"
              v-bind="modal.formItemLayout"
            >
              <a-input
                :disabled="modal.mode === 'edit'"
                v-decorator="['id',{ rules: [{ required: true, message: '请输入角色编码!' }]} ]"
              />
            </a-form-item>
            <a-form-item
              label="状态"
              v-bind="modal.formItemLayout"
            >
              <a-radio-group v-decorator="['state',{ rules: [{ required: true, message: '请选择状态!' }]} ]" >
                <a-radio value="ON">启用</a-radio>
                <a-radio value="OFF">禁用</a-radio>
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
    </keep-alive>
    <transition name="page-transition">
      <router-view ></router-view>
    </transition>
  </div>
</template>
<script>
import { list, add, update, toggleState, remove } from '@/api/sys/role'
import { modalForm } from '@/utils/util'
import SingleSearchForm from '@/components/Service/SingleSearchForm'
export default {
  name: 'Role',
  components: {
    SingleSearchForm
  },
  data () {
    return {
      description: '',
      form: this.$form.createForm(this),
      loading: false,
      columns: [
        { title: '状态', dataIndex: 'state', align: 'center', scopedSlots: { customRender: 'state' } },
        { title: '角色名', dataIndex: 'name' },
        { title: '角色编码', dataIndex: 'id' },
        { title: '介绍', dataIndex: 'intro' },
        { title: '操作', key: 'action', align: 'right', scopedSlots: { customRender: 'action' } }
      ],
      data: [],
      searchFields: [
        { name: '角色名称', code: 'search_LIKE_name' },
        { name: '角色编码', code: 'search_LIKE_id' }
      ],
      pagination: {
        showSizeChanger: true,
        total: 0,
        current: 1,
        pageSize: 10
      },
      filter: {},
      modal: modalForm()
    }
  },
  created () {
    this.loadData()
  },
  watch: {
    $route (to, from) {
      console.log('Role 页面监听到 子路由变化')
      // 子路由description 无法更新到 PageView, 所以手动控制
      if (to.name === 'RoleConfigResources') {
        this.description = `左侧为 角色 ${to.params.roleId} 未拥有资源，右侧为已拥有资源`
      }
      if (to.name === 'Role') {
        this.description = ''
      }
    }
  },
  methods: {
    loadData () {
      // 加载表格数据
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
      this.modal.title = '新增角色'
      this.modal.mode = 'add'
      this.modal.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          state: 'ON'
        })
      })
    },
    handleEdit (record) {
      this.modal.title = '编辑角色'
      this.modal.mode = 'edit'
      this.modal.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id,
          name: record.name,
          state: record.state,
          intro: record.intro
        })
      })
    },
    handleConfigResources (id) {
      this.$router.push({ name: 'RoleConfigResources', params: { roleId: id } })
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
    }
  }
}
</script>
