<template>
  <a-card :bordered="false">
    <search-form :searchFields="searchFields" :pmd="8" @search="handleSearchEvent"/>
    <a-list itemLayout="horizontal" size="large" :loading="loading" :pagination="pagination" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item" key="item.title">
        <a-button slot="actions" type="link" @click="handleRemove(item.id)">删除</a-button>
        <a-list-item-meta :description="item.content">
          <a slot="title" :href="item.href">{{ item.title }}</a>
          <a-avatar slot="avatar" :src="`${fileServer}/${item.logo}`" />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>
<script>
import { listReadMsg, delMsg } from '@/api/account'
import SearchForm from '@/views/components/SearchForm'

export default {
  name: 'MsgRead',
  components: {
    SearchForm
  },
  data () {
    return {
      loading: false,
      data: [],
      searchFields: [
        { name: '标题', code: 'title' },
        { name: '内容', code: 'content' },
        { name: '开始时间', code: 'start', type: 'datetime' },
        { name: '结束时间', code: 'end', type: 'datetime' }
      ],
      filter: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 6,
        onChange: (page, size) => {
          this.pagination.current = page
          this.pagination.pageSize = size
          this.loadData()
        }
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
      listReadMsg(body).then((result) => {
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
    handleRemove (id) {
      delMsg(id).then((result) => {
        result.status && this.loadData()
      })
    }
  }
}
</script>
