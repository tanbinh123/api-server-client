<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="10" :sm="24">
            <a-form-item label="内容">
              <a-input v-model="query.search_LIKE_action_name" placeholder="请输入内容"/>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="24">
            <a-form-item label="Ip">
              <a-input v-model="query.search_LIKE_ip" placeholder="请输入Ip"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" style="text-align: right">
            <span class="table-page-search-submitButtons">
              <a-button @click="handleSearch" icon="search">查询</a-button>
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
      :pagination="pagination"
      @change="handleChange"
      :rowKey="record => record.id" >
    </a-table>
  </a-card>
</template>
<script>
import { listLog } from '@/api/account'
import { noEmptyFieldsObj } from '@/utils/util.curd'
export default {
  name: 'Log',
  data () {
    return {
      rowBtnSize: 'small',
      loading: false,
      columns: [
        { title: '日志', dataIndex: 'actionName' },
        { title: '时间', dataIndex: 'createTime' },
        { title: 'IP', dataIndex: 'ip' },
        { title: 'URI', dataIndex: 'uri' }
      ],
      data: [],
      query: {
        search_LIKE_ip: '',
        search_LIKE_action_name: ''
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
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
        current: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      listLog(body).then((result) => {
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
    }
  }
}
</script>
