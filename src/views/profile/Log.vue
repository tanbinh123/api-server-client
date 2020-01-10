<template>
  <a-card :bordered="false">
    <search-form :searchFields="searchFields" @search="handleSearchEvent"/>
    <a-table
      :bordered="false"
      :columns="columns"
      :loading="loading"
      :size="tableSize"
      :dataSource="data"
      :pagination="pagination"
      @change="handleChange"
      :rowKey="record => record.id" >
    </a-table>
  </a-card>
</template>
<script>
import { listLog } from '@/api/account'
import SearchForm from '@/views/components/SearchForm'
export default {
  name: 'Log',
  components: {
    SearchForm
  },
  data () {
    return {
      loading: false,
      columns: [
        { title: '日志', dataIndex: 'actionName' },
        { title: 'IP地址', dataIndex: 'ip' },
        { title: '时间', dataIndex: 'createTime' }
      ],
      data: [],
      searchFields: [
        { name: 'IP地址', code: 'search_LIKE_ip' },
        { name: '操作', code: 'search_LIKE_action_name' }
      ],
      filter: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 8
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
      listLog(body).then((result) => {
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
    }
  }
}
</script>
