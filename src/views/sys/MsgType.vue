<template>
  <a-card :bordered="false">
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
      :rowKey="record => record.id">
      <template slot="logo" slot-scope="logo">
        <a-avatar :src="`${fileServer}/${logo}`"/>
      </template>
      <template slot="state" slot-scope="state">
        <a-badge v-if="state === 'ON'" status="success"/>
        <a-badge v-else status="error"/>
      </template>
      <template slot="action" slot-scope="record">
        <div class="row-operations">
          <a-tooltip v-action:sysMsgType:toggle :title=" record.state==='ON'?'启用':'禁用' ">
            <a-switch :size="rowBtnSize" :checked="record.state === 'ON'" @change="toggleState(record)"/>
          </a-tooltip>
          <a-button class="rowBtn" :size="rowBtnSize" type="link" v-action:sysMsgType:update @click="handleEdit(record)">
            编辑
          </a-button>
          <a-popconfirm
            v-action:sysMsgType:remove
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
              :size="rowBtnSize">删除
            </a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-modal
      width="640px"
      :visible="modal.visible"
      :title="modal.title"
      :confirmLoading="modal.confirmLoading"
      @cancel="handleModalCancel"
      @ok="handleModalOk"
    >
      <a-form
        :form="form"
      >
        <a-row :gutter="10" >
          <a-col :xs="24">
            <a-form-item
              label="编码"
              v-bind="formItemLayout"
            >
              <a-input
                :disabled="modal.mode === 'edit'"
                v-decorator="['id',{ rules: [{ required: true, message: '统一识别码!' }]} ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10" >
          <a-col :xs="12" >
            <a-form-item
              label="标题"
              v-bind="formItemLayout2"
            >
              <a-input v-decorator="['name',{ rules: [{ required: true, message: '请输入标题!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :xs="12">
            <a-form-item
              label="推送"
              v-bind="formItemLayout2"
            >
              <a-select
                v-decorator="['pushMode',{ rules: [{ required: true, message: '请选择推送方式!' }]}]">
                <a-select-option v-for="(item,i) in pushMode" :key="i" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :xs="12">
            <avatar-upload :imgPath.sync="modal.form.logo" itemLabel="图标" :formItemLayout="formItemLayout2"/>
          </a-col>
          <a-col :xs="12">
            <a-form-item
              label="状态"
              v-bind="formItemLayout2"
            >
              <a-radio-group v-decorator="['state',{ rules: [{ required: true, message: '请选择状态!' }]} ]">
                <a-radio value="ON">启用</a-radio>
                <a-radio value="OFF">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10" >
          <a-col :xs="12">
            <a-form-item
              label="过期"
              v-bind="formItemLayout2"
            >
              <a-input-number
                :min="0"
                v-decorator="['expiry',{ rules: [{ required: true, message: '请输入过期天数!' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="12">
            <a-form-item
              label="作废"
              v-bind="formItemLayout2"
            >
              <a-input-number
                :min="0"
                v-decorator="['dead',{ rules: [{ required: true, message: '请输入作废天数!' }]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :xs="24">
            <a-form-item
              label="模板"
              v-bind="formItemLayout"
            >
              <a-textarea
                :rows="4"
                v-decorator="['template',{ rules: [{ required: true, message: '请输入模板!' }]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :xs="24">
            <a-form-item
              label="备注"
              v-bind="formItemLayout"
            >
              <a-textarea
                :rows="3"
                v-decorator="['remark']"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10" >
          <a-col :xs="24" >
            <a-form-item
              label="接收者"
              v-bind="formItemLayout"
            >
              <tags-input :tags.sync="modal.form.audience" :confirmCallback="tagsInputConfirmCbk" btnText="新受众" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import { add, list, remove, toggleState, update } from '@/api/sys/msgType'
import { modalFormSetting } from '@/utils/util.curd'
import TagsInput from '@/views/components/TagsInput'
import AvatarUpload from '@/views/components/AvatarUpload'
import SearchForm from '@/views/components/SearchForm'

const modalSetting = modalFormSetting()
modalSetting.form.logo = ''
modalSetting.form.audience = []
const pushMode = [
  { label: 'WS', value: 'WS' },
  { label: '邮件', value: 'EMAIL' },
  { label: '微信', value: 'WX' }
]
export default {
  name: 'MsgType',
  components: {
    SearchForm,
    TagsInput,
    AvatarUpload
  },
  data () {
    return {
      description: '',
      form: this.$form.createForm(this),
      rowBtnSize: 'small',
      loading: false,
      columns: [
        { title: '图标', dataIndex: 'logo', align: 'center', scopedSlots: { customRender: 'logo' } },
        { title: '编码', dataIndex: 'id' },
        { title: '标题', dataIndex: 'name' },
        { title: '推送方式', dataIndex: 'pushMode' },
        { title: '过期天数', dataIndex: 'expiry' },
        { title: '作废天数', dataIndex: 'dead' },
        { title: '状态', dataIndex: 'state', align: 'center', scopedSlots: { customRender: 'state' } },
        { title: '操作', key: 'action', align: 'right', scopedSlots: { customRender: 'action' } }
      ],
      data: [],
      pushMode: pushMode,
      searchFields: [
        { name: '标题', code: 'search_LIKE_name' },
        { name: '编码', code: 'search_LIKE_id' },
        {
          name: '推送方式',
          code: 'search_LIKE_push_mode',
          type: 'select',
          list: pushMode
        },
        {
          name: '状态',
          code: 'search_LIKE_state',
          type: 'radio',
          list: [
            { label: '启用', value: 'ON' },
            { label: '禁用', value: 'OFF' }
          ]
        }
      ],
      pagination: {
        showSizeChanger: true,
        total: 0,
        current: 1,
        pageSize: 10
      },
      filter: {},
      modal: modalSetting,
      formItemLayout: {
        labelCol: { xs: { span: 24 }, sm: { span: 3 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 21 } }
      },
      formItemLayout2: {
        labelCol: { xs: { span: 24 }, sm: { span: 6 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
      },
      tagsInputConfirmCbk: (tag) => {
        if (tag.startsWith('user:') || tag.startsWith('role:')) {
          return true
        }
        this.$message.error('受众必须 是 user: 或 role: 开头的字符')
        return false
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
      this.modal.title = '新增'
      this.modal.mode = 'add'
      this.modal.visible = true
      this.modal.form.logo = ''
      this.modal.form.logoLoading = false
      this.$nextTick(() => {
        this.form.setFieldsValue({
          state: 'ON',
          pushMode: 'WS',
          expiry: 10,
          dead: 10
        })
      })
    },
    handleEdit (record) {
      this.modal.title = '编辑'
      this.modal.mode = 'edit'
      this.modal.visible = true
      this.modal.form.logo = record.logo
      this.modal.form.audience = record.audience.split(',')
      this.modal.form.logoLoading = false
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id,
          name: record.name,
          cate: record.cate,
          pushMode: record.pushMode,
          template: record.template,
          state: record.state,
          expiry: record.expiry,
          dead: record.dead,
          remark: record.remark
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
          delete values.imgFile
          values.logo = this.modal.form.logo
          values.audience = this.modal.form.audience
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
      this.modal.form.audience = []
      this.modal.visible = false
    }
  }
}
</script>
