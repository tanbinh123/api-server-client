<template>
  <a-row :gutter="8" style="margin-top: 10px">
    <a-col :xs="24" :sm="24" :md="7">
      <a-card :size="defaultSize" :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="5">
              <a-col :xs="24" style="margin-bottom: 10px">
                <template v-if="noRoles.selectedRowKeys.length>0">
                  {{ `已选 ${noRoles.selectedRowKeys.length} 个角色` }}
                </template>
                <template v-else>
                  选择需要添加的角色
                </template>
              </a-col>
              <a-col :xs="18">
                <a-form-item label="角色">
                  <a-input v-model="noRoles.query.key" placeholder="输入角色筛选"/>
                </a-form-item>
              </a-col>
              <a-col :xs="3">
                <span class="table-page-search-submitButtons">
                  <a-button shape="circle" @click="noRolesHandleSearch"> <a-icon type="search" /></a-button>
                </span>
              </a-col>
              <a-col :xs="3">
                <a-tooltip title="添加" placement="top">
                  <a-button
                    shape="circle"
                    icon="plus"
                    type="primary"
                    :disabled="noRoles.selectedRowKeys.length===0"
                    :loading="noRoles.addBtnLoading"
                    @click="handleAddUserRoles">
                  </a-button>
                </a-tooltip>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table
          :bordered="false"
          :columns="noRoles.columns"
          :loading="noRoles.loading"
          :size="tableSize"
          :dataSource="noRoles.data"
          :pagination="noRoles.pagination"
          :rowSelection="{selectedRowKeys: noRoles.selectedRowKeys, onChange: noRolesOnSelectChange}"
          :rowKey="record => record.id"
          @change="noRolesHandleChange">
          <span slot="name" slot-scope="name, record">
            <span v-if="record.state === 'ON'" >{{ name }}/{{ record.id }}</span>
            <span style="color:red" v-else >{{ name }}/{{ record.id }}</span>
          </span>
        </a-table>
      </a-card>
    </a-col>
    <a-col :xs="24" :sm="24" :md="17">
      <a-card :loading="user.loading" :bordered="false">
        <a-card-meta>
          <a slot="title">{{ user.username }} <template v-if="user.nickname"> - {{ user.nickname }}</template></a>
          <a-avatar class="card-avatar" slot="avatar" :src="`${fileServer}/${user.avatar}`" :size="64"/>
          <div class="meta-content" slot="description">
            <a-row>
              <a-col :xs="12">电话: {{ user.phone }}</a-col>
              <a-col :xs="12">邮箱: {{ user.email }}</a-col>
            </a-row>
            <a-row v-if="user.intro">
              <a-col :xs="24">{{ user.intro }}</a-col>
            </a-row>
          </div>
        </a-card-meta>
      </a-card>
      <a-card :bordered="false" >
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="10">
              <a-col :xs="12" >
                <a-tooltip title="移除" placement="top">
                  <a-button
                    shape="circle"
                    icon="delete"
                    type="danger"
                    :disabled="haveRoles.selectedRowKeys.length===0"
                    :loading="haveRoles.delBtnLoading"
                    @click="handleDelUserRoles">
                  </a-button>
                </a-tooltip>
                <span v-if="haveRoles.selectedRowKeys.length>0" style="margin-left:10px">
                  {{ `已选 ${haveRoles.selectedRowKeys.length} 个角色` }}
                </span>
              </a-col>
              <a-col :xs="10" style="text-align: right">
                <a-form-item label="角色">
                  <a-input v-model="haveRoles.query.key" placeholder="请输入角色筛选"/>
                </a-form-item>
              </a-col>
              <a-col :xs="2" >
                <span class="table-page-search-submitButtons">
                  <a-button shape="circle" @click="haveRolesHandleSearch"> <a-icon type="search" /></a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table
          :bordered="false"
          :columns="haveRoles.columns"
          :loading="haveRoles.loading"
          :size="tableSize"
          :dataSource="haveRoles.data"
          :rowSelection="{selectedRowKeys: haveRoles.selectedRowKeys, onChange: haveRolesOnSelectChange}"
          :pagination="haveRoles.pagination"
          :rowKey="record => record.id"
          @change="haveRolesHandleChange">
          <span slot="name" slot-scope="name, record">
            <span v-if="record.state === 'ON'" >{{ name }}/{{ record.id }}</span>
            <span style="color:red" v-else >{{ name }}/{{ record.id }}</span>
          </span>
        </a-table>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import { detail, listNoRoles, listHaveRoles, addUserRoles, delUserRoles } from '@/api/sys/user'
import { noEmptyFieldsObj } from '@/utils/util.curd'
export default {
  name: 'UserConfigRoles',
  data () {
    return {
      defaultSize: 'small',
      user: {
        loading: true,
        nickname: '',
        username: '',
        avatar: '',
        phone: '',
        email: '',
        intro: ''
      },
      noRoles: {
        loading: false,
        columns: [
          { title: '角色', dataIndex: 'name', scopedSlots: { customRender: 'name' } }
        ],
        data: [],
        query: {
          key: ''
        },
        pagination: {
          total: 0,
          current: 1,
          pageSize: 8
        },
        selectedRowKeys: [],
        addBtnLoading: false
      },
      haveRoles: {
        loading: false,
        columns: [
          { title: '角色', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
          { title: '介绍', dataIndex: 'intro', width: '40%' },
          { title: '创建人', dataIndex: 'creater' },
          { title: '创建时间', dataIndex: 'createTime' }
        ],
        data: [],
        query: {
          key: ''
        },
        pagination: {
          total: 0,
          current: 1,
          pageSize: 5
        },
        selectedRowKeys: [],
        delBtnLoading: false
      }
    }
  },
  computed: {
    noRolesFilter () {
      return noEmptyFieldsObj(this.noRoles.query)
    },
    haveRolesFilter () {
      return noEmptyFieldsObj(this.haveRoles.query)
    }
  },
  mounted () {
    this.loadUserInfo()
    this.loadNoRolesData()
    this.loadHaveRolesData()
  },
  // created () {
  //   this.loadUserInfo()
  //   this.loadNoRolesData()
  //   this.loadHaveRolesData()
  // },
  // beforeRouteLeave (to, from, next) {
  //   next()
  //   // 为了每次进入能更新数据，离开时销毁本组件
  //   this.$destroy()
  // },
  methods: {
    loadUserInfo () {
      const userId = this.$route.params.userId
      detail(userId).then((result) => {
        if (result.status) {
          this.user.username = result.data.id
          this.user.phone = result.data.phone
          this.user.email = result.data.email
          this.user.avatar = result.data.avatar
          this.user.intro = result.data.intro
          this.user.nickname = result.data.nickname
        }
      }).finally(() => {
        this.user.loading = false
      })
    },
    loadNoRolesData () {
      // 加载用户没有的角色列表
      const userId = this.$route.params.userId
      this.noRoles.selectedRowKeys = []
      this.noRoles.loading = true
      const body = {
        filter: this.noRolesFilter,
        current: this.noRoles.pagination.current,
        pageSize: this.noRoles.pagination.pageSize
      }
      listNoRoles(userId, body).then((result) => {
        this.noRoles.data = result.data.records
        this.noRoles.pagination.current = result.data.current
        this.noRoles.pagination.total = result.data.total
        this.noRoles.pagination.pageSize = result.data.pageSize
      }).finally(() => {
        this.noRoles.loading = false
      })
    },
    noRolesOnSelectChange (selectedRowKeys) {
      // 表格复选框选中
      this.noRoles.selectedRowKeys = selectedRowKeys
    },
    noRolesHandleChange (pagination) {
      // 翻页
      this.noRoles.pagination = pagination
      this.loadNoRolesData()
    },
    noRolesHandleSearch () {
      // 查询
      this.noRoles.pagination.current = 1
      this.noRoles.pagination.total = 0
      this.loadNoRolesData()
    },
    handleAddUserRoles () {
      // 增加按钮
      this.noRoles.addBtnLoading = true
      const userId = this.$route.params.userId
      addUserRoles(userId, this.noRoles.selectedRowKeys).then((result) => {
        if (result.status) {
          this.haveRoles.pagination.current = 1
          this.haveRoles.pagination.total = 0
          this.loadHaveRolesData()
          this.noRoles.pagination.current = 1
          this.noRoles.pagination.total = 0
          this.loadNoRolesData()
        }
      }).finally(() => {
        this.noRoles.addBtnLoading = false
      })
    },
    loadHaveRolesData () {
      // 加载用户有的角色列表
      const userId = this.$route.params.userId
      this.haveRoles.selectedRowKeys = []
      this.haveRoles.loading = true
      const body = {
        filter: this.haveRolesFilter,
        current: this.haveRoles.pagination.current,
        pageSize: this.haveRoles.pagination.pageSize
      }
      listHaveRoles(userId, body).then((result) => {
        this.haveRoles.data = result.data.records
        this.haveRoles.pagination.current = result.data.current
        this.haveRoles.pagination.total = result.data.total
        this.haveRoles.pagination.pageSize = result.data.pageSize
      }).finally(() => {
        this.haveRoles.loading = false
      })
    },
    haveRolesOnSelectChange (selectedRowKeys) {
      // 表格复选框选中
      this.haveRoles.selectedRowKeys = selectedRowKeys
    },
    haveRolesHandleChange (pagination) {
      // 翻页
      this.haveRoles.pagination = pagination
      this.loadHaveRolesData()
    },
    haveRolesHandleSearch () {
      // 查询
      this.haveRoles.pagination.current = 1
      this.haveRoles.pagination.total = 0
      this.loadHaveRolesData()
    },
    handleDelUserRoles () {
      // 删除按钮
      this.haveRoles.addBtnLoading = true
      const userId = this.$route.params.userId
      delUserRoles(userId, this.haveRoles.selectedRowKeys).then((result) => {
        if (result.status) {
          this.noRoles.pagination.current = 1
          this.noRoles.pagination.total = 0
          this.loadNoRolesData()
          this.haveRoles.pagination.current = 1
          this.haveRoles.pagination.total = 0
          this.loadHaveRolesData()
        }
      }).finally(() => {
        this.noRoles.addBtnLoading = false
      })
    }
  }
}
</script>
