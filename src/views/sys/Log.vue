<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户">
              <a-input v-model="query.search_LIKE_username" placeholder="请输入用户名"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="内容">
              <a-input v-model="query.search_LIKE_action_name" placeholder="请输入内容"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="Ip">
              <a-input v-model="query.search_LIKE_ip" placeholder="请输入Ip"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" >
            <span class="table-page-search-submitButtons">
              <a-button @click="handleSearch" type="primary" icon="search">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button
        v-action:sysLog:remove
        type="danger"
        icon="delete"
        :loading="removeBtnLoading"
        :disabled="selectedRowKeys.length === 0"
        @click="handleRemove">删除</a-button>
      <template v-if="selectedRowKeys.length > 0">已选中 {{ selectedRowKeys.length }} 条数据</template>
    </div>
    <a-table
      :bordered="false"
      :columns="columns"
      :loading="loading"
      :dataSource="data"
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
          :size="rowBtnSize"
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
import { noEmptyFieldsObj } from '@/utils/util.curd'
export default {
  name: 'Log',
  data () {
    return {
      // description: '',
      rowBtnSize: 'small',
      loading: false,
      removeBtnLoading: false,
      columns: [
        { title: 'URI', dataIndex: 'uri', scopedSlots: { customRender: 'uri' } },
        { title: '日志', dataIndex: 'actionName' },
        { title: '用户', dataIndex: 'username' },
        { title: '时间', dataIndex: 'createTime' },
        { title: 'IP', dataIndex: 'ip' },
        { title: '操作', key: 'ope', scopedSlots: { customRender: 'ope' } }
      ],
      data: [],
      query: {
        search_LIKE_username: '',
        search_LIKE_ip: '',
        search_LIKE_action_name: ''
      },
      pagination: {
        showSizeChanger: true,
        total: 0,
        current: 1,
        pageSize: 10
      },
      selectedRowKeys: [],
      modalVisible: false,
      detail: {}
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
    handleSearch () {
      this.pagination.current = 1
      this.pagination.total = 0
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
<style>
  .label {
    font-weight: 600;
    padding-bottom: 5px;
  }
  .value {
    padding-bottom: 10px;
  }
</style>
