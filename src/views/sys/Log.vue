<template>
  <a-card :bordered="false">
    <single-search-form :searchFields="searchFields" @search="handleSearchEvent">
      <template #head>
        <a-button
          v-action:sysLog:remove
          type="danger"
          icon="delete"
          :loading="removeBtnLoading"
          :disabled="selectedRowKeys.length === 0"
          @click="handleRemove">删除</a-button>
        <template v-if="selectedRowKeys.length > 0"><span style="margin-left: 5px"> 已选中 {{ selectedRowKeys.length }} 条数据</span></template>
      </template>
    </single-search-form>
    <a-table
      :bordered="false"
      :columns="columns"
      :loading="loading"
      :dataSource="data"
      :size="tableSize"
      :pagination="pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: (selectedRowKeys) => {this.selectedRowKeys = selectedRowKeys}}"
      @change="handleChange"
      :rowKey="record => record.id" >
      <template slot="uri" slot-scope="uri, record">
        <a-tag color="blue">{{ record.httpMethod }}</a-tag> {{ uri }}
      </template>
      <template slot="ope" slot-scope="record">
        <a-button
          class="rowBtn"
          type="link"
          size="small"
          @click="handleDetail(record)">详情</a-button>
      </template>
    </a-table>
    <a-modal
      :title="detail.actionName"
      v-model="modalVisible"
      :footer="null"
    >
      <a-row>
        <a-row :span="24" class="label">Class:</a-row>
        <a-row :span="24" class="value">{{detail.classMethod}}</a-row>
        <a-row :span="24" class="label">参数: </a-row>
        <a-row :span="24" class="value">{{detail.params}}</a-row>
        <a-row :span="24" class="label">响应: </a-row>
        <a-row :span="24" class="value">{{ detail.result }}</a-row>
      </a-row>
    </a-modal>
  </a-card>
</template>
<script>
import { list, remove } from '@/api/sys/log'
import SingleSearchForm from '@/views/components/SingleSearchForm'
export default {
  name: 'Log',
  components: {
    SingleSearchForm
  },
  data () {
    return {
      // description: '',
      loading: false,
      removeBtnLoading: false,
      columns: [
        { title: 'URI', dataIndex: 'uri', scopedSlots: { customRender: 'uri' } },
        { title: '日志', dataIndex: 'actionName' },
        { title: '用户', dataIndex: 'username' },
        { title: '时间', dataIndex: 'createTime' },
        { title: 'IP', dataIndex: 'ip' },
        { title: '操作', key: 'ope', align: 'right', scopedSlots: { customRender: 'ope' } }
      ],
      data: [],
      searchFields: [
        { name: '用户名', code: 'search_LIKE_username' },
        { name: '内容', code: 'search_LIKE_action_name' },
        { name: 'IP地址', code: 'search_LIKE_ip' }
      ],
      pagination: {
        showSizeChanger: true,
        total: 0,
        current: 1,
        pageSize: 10
      },
      filter: {},
      selectedRowKeys: [],
      modalVisible: false,
      detail: {}
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
        order: {
          column: 'create_time',
          sort: 'desc'
        },
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
    handleRemove () {
      this.removeBtnLoading = true
      remove(this.selectedRowKeys).then((result) => {
        if (result.status) {
          this.selectedRowKeys = []
          this.loadData()
        }
      }).finally(() => {
        this.removeBtnLoading = false
      })
    },
    handleDetail (detail) {
      this.detail = detail
      this.modalVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
  .ant-modal-body {
    .label {
      font-weight: 600;
      padding-bottom: 5px;
    }
    .value {
      padding-bottom: 10px;
    }
  }
</style>
