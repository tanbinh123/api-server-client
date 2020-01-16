<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col :md="10" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button v-action:sysDict:add type="primary" icon="plus" @click="handleAdd">新增</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="方式">
              <a-select v-model="query.type" @change="handleTypeChange" >
                <a-select-option value="LIKE">模糊</a-select-option>
                <a-select-option value="EQ">精确</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item :label="query.type==='LIKE'?'名称/编码':'编码'">
              <a-input v-model="query.key" @pressEnter="handleSearch" :placeholder="query.type==='LIKE'?'模糊查找不带层级结构':'精确查找带层级结构'"/>
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleSearch"> 查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      :bordered="false"
      :columns="columns"
      :loading="loading"
      :dataSource="data"
      :size="tableSize"
      :pagination="pagination"
      @change="handleChange"
      :rowKey="record => record.id" >
      <template slot="type" slot-scope="type">
        <template v-if="type === 'btn'">按钮</template>
        <template v-else>菜单</template>
      </template>
      <template slot="state" slot-scope="state">
        <a-badge v-if="state === 'ON'" status="success" />
        <a-badge v-else status="error" />
      </template>
      <template slot="action" slot-scope="record">
        <div class="row-operations">
          <a-tooltip v-action:sysDict:toggle :title=" record.state==='ON'?'启用':'禁用' " >
            <a-switch size="small" :checked="record.state === 'ON'" @change="toggleState(record)" />
          </a-tooltip>
          <a-button
            v-action:sysDict:add
            class="rowBtn"
            type="link"
            size="small"
            @click="handleAddChildren(record)">添加下级</a-button>
          <a-button
            v-action:sysDict:update
            class="rowBtn"
            type="link"
            size="small"
            @click="handleEdit(record)">编辑</a-button>
          <a-popconfirm
            v-action:sysDict:remove
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
          v-if="modal.mode==='edit'"
          class="hidden"
          label="上级组"
          v-bind="modal.formItemLayout"
        >
          <a-input v-decorator="['id']"/>
        </a-form-item>
        <a-form-item
          label="上级组"
          v-bind="modal.formItemLayout"
        >
          <a-tree-select
            showSearch
            treeNodeFilterProp="title"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            v-decorator="['pid',{ rules: [{ required: true, message: '请选择上级组!' }]} ]"
            placeholder="请选择上级组"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item
          label="名称"
          v-bind="modal.formItemLayout"
        >
          <a-input
            v-decorator="['name',{ rules: [{ required: true, message: '请输入名称!' }]} ]"
          />
        </a-form-item>
        <a-form-item
          label="编码"
          v-bind="modal.formItemLayout"
        >
          <a-input v-decorator="['code',{ rules: [{ required: true, message: '请输入编码!' }]} ]"/>
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
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
import { list, listTreeData, add, update, toggleState, remove } from '@/api/sys/dataDict'
import { noEmptyFieldsObj, modalFormSetting } from '@/utils/util.curd'
export default {
  name: 'DataDict',
  components: {
    ATreeSelect: TreeSelect
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      columns: [
        { title: '名称', dataIndex: 'name' },
        { title: '编码', dataIndex: 'code' },
        { title: '排序号', dataIndex: 'sort' },
        { title: '状态', dataIndex: 'state', align: 'center', scopedSlots: { customRender: 'state' } },
        { title: '操作', key: 'action', align: 'right', scopedSlots: { customRender: 'action' } }
      ],
      data: [],
      treeData: [],
      query: {
        type: 'LIKE',
        key: ''
      },
      pagination: {
        showSizeChanger: true,
        total: 0,
        current: 1,
        pageSize: 10
      },
      modal: modalFormSetting()
    }
  },
  computed: {
    filter () {
      return noEmptyFieldsObj(this.query)
    }
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
    loadTreeData (currentKey) {
      listTreeData(currentKey).then((result) => {
        if (result.status) {
          this.treeData = [result.data]
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    handleTypeChange (value) {
      this.query.key = ''
      if (value === 'LIKE') {
        this.$message.info('模糊查找不带层级结构')
      } else {
        this.$message.info('精确查找带层级结构, 仅能通过编码查询')
      }
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
      this.modal.title = '新增'
      this.modal.mode = 'add'
      this.loadTreeData()
      this.modal.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          pid: '0',
          sort: 0,
          state: 'ON'
        })
      })
    },
    toggleState (record) {
      toggleState(record.id).then(result => {
        result.status && this.loadData()
      })
    },
    handleEdit (record) {
      this.modal.title = '编辑'
      this.modal.mode = 'edit'
      this.loadTreeData(record.id)
      this.modal.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id,
          pid: record.pid,
          name: record.name,
          code: record.code,
          state: record.state,
          sort: record.sort
        })
      })
    },
    handleAddChildren (record) {
      this.modal.title = `新增下级`
      this.modal.mode = 'addChildren'
      this.loadTreeData()
      this.modal.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          pid: record.id,
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
