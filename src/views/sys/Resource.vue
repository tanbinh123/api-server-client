<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="query.search_LIKE_name" placeholder="请输入资源名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="编码">
              <a-input v-model="query.search_LIKE_id" placeholder="请输入编码"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleSearch"> <a-icon type="search" /> 查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <a-row :gutter="48">
        <a-col :span="24">
          <span class="table-page-search-submitButtons">
            <a-button v-action:sysResource:add type="primary" @click="handleAdd">  <a-icon type="plus" /> 添加资源</a-button>
          </span>
        </a-col>
      </a-row>
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
      <span slot="type" slot-scope="type, record">
        <a-tag v-if="type === 'btn'">按钮</a-tag>
        <a-tag v-else>菜单</a-tag>
        <a-tag v-if="record.state === 'ON'">启用</a-tag>
        <a-tag v-else color="red">禁用</a-tag>
      </span>
      <span slot="action" slot-scope="record">
        <a-tooltip v-action:sysResource:toggle :title=" record.state==='ON'?'启用':'禁用' " >
          <a-switch :size="rowBtnSize" :checked="record.state === 'ON'" @change="toggleState(record)" />
        </a-tooltip>
        <a-tooltip v-if="record.type === 'menu'" v-action:sysResource:add title="添加下级">
          <a-button
            class="rowBtn"
            type="primary"
            shape="circle"
            icon="plus"
            :size="rowBtnSize"
            @click="handleAddChildren(record)"></a-button>
        </a-tooltip>
        <a-tooltip v-action:sysResource:update title="编辑">
          <a-button
            class="rowBtn"
            shape="circle"
            icon="edit"
            :size="rowBtnSize"
            @click="handleEdit(record)"></a-button>
        </a-tooltip>
        <a-popconfirm
          v-action:sysResource:remove
          placement="left"
          title="你确定要删除这条数据吗?"
          trigger="hover"
          @confirm="handleRemove(record.id)"
          okText="是"
          cancelText="否"
        >
          <a-button
            class="rowBtn"
            type="danger"
            shape="circle"
            icon="delete"
            :size="rowBtnSize"></a-button>
        </a-popconfirm>
      </span>
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
          label="类型"
          v-bind="modal.formItemLayout"
        >
          <a-radio-group :disabled="modal.mode === 'edit'" v-decorator="['type',{ rules: [{ required: true, message: '请选择资源类型!' }]} ]" >
            <a-radio value="menu" :disabled="modal.mode === 'addChildren'">菜单</a-radio>
            <a-radio value="btn" :disabled="modal.mode === 'add'">按钮</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="名称"
          v-bind="modal.formItemLayout"
        >
          <a-input
            v-decorator="['name',{ rules: [{ required: true, message: '请输入资源名称!' }]} ]"
          />
        </a-form-item>
        <a-form-item
          label="权限编码"
          v-bind="modal.formItemLayout"
        >
          <a-input
            :disabled="modal.mode === 'edit'"
            v-decorator="['id',{ rules: [{ required: true, message: '请输入资源权限编码!' }]} ]"
          />
        </a-form-item>
        <a-form-item
          label="排序号"
          v-bind="modal.formItemLayout"
        >
          <a-input-number :min="0" v-decorator="['sort',{ rules: [{ required: true, message: '请输入排序号!' }]} ]"/>
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
          label="备注"
          v-bind="modal.formItemLayout"
        >
          <a-input
            type="textarea"
            v-decorator="['remark']"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { list, add, update, toggleState, remove } from '@/api/sys/resource'
import { noEmptyFieldsObj, modalFormSetting } from '@/utils/util.curd'
export default {
  name: 'Resource',
  data () {
    return {
      // description: '配置系统资源权限，系统资源分为 菜单 和 按钮, 菜单可以包含按钮。',
      rowBtnSize: 'small',
      loading: false,
      columns: [
        { title: '资源名称', dataIndex: 'name' },
        { title: '权限标识', dataIndex: 'id' },
        { title: '类型状态', dataIndex: 'type', align: 'center', scopedSlots: { customRender: 'type' } },
        { title: '排序号', dataIndex: 'sort', align: 'center' },
        { title: '操作', key: 'action', align: 'right', scopedSlots: { customRender: 'action' } }
      ],
      data: [],
      query: {
        // 查询参数
        search_LIKE_name: '',
        search_LIKE_id: ''
      },
      pagination: {
        // 表格分页
        showSizeChanger: true,
        total: 0,
        current: 1,
        pageSize: 10
      },
      // 弹窗，新增、编辑表单
      modal: modalFormSetting()
    }
  },
  computed: {
    filter () {
      // 实际生效（向后端）传递的 查询条件
      return noEmptyFieldsObj(this.query)
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      // 加载数据
      this.loading = true
      const body = {
        filter: this.filter,
        orders: [
          { column: 'sort', sort: 'asc' },
          { column: 'id', sort: 'asc' }
        ],
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
    handleSearch () {
      this.pagination.current = 1
      this.pagination.total = 0
      this.loadData()
    },
    handleChange (pagination) {
      this.pagination = pagination
      this.loadData()
    },
    handleAdd () {
      this.modal.title = '新增资源'
      this.modal.mode = 'add'
      this.modal.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          type: 'menu',
          state: 'ON',
          sort: 1
        })
      })
    },
    toggleState (record) {
      toggleState(record.id).then(result => {
        result.status < 100 && this.loadData()
      })
    },
    handleEdit (record) {
      this.modal.title = '编辑资源'
      this.modal.mode = 'edit'
      this.modal.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id,
          type: record.type,
          name: record.name,
          state: record.state,
          sort: record.sort,
          remark: record.remark
        })
      })
    },
    handleAddChildren (record) {
      this.modal.title = `新增下级按钮`
      this.modal.mode = 'addChildren'
      this.modal.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id + ':',
          type: 'btn',
          state: 'ON',
          sort: record.children ? record.children[record.children.length - 1].sort + 1 : 0
        })
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
          console.log('Received values of form: ', values)
          this.modal.confirmLoading = true
          if (this.modal.mode === 'add' || this.modal.mode === 'addChildren') {
            // 增加资源
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
