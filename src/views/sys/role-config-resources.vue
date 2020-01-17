<template>
  <a-row :gutter="8" style="margin-top: 10px">
    <a-col :xs="24" :sm="24" :md="8">
      <a-card :size="defaultSize" :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="5">
              <a-col :xs="24" style="margin-bottom: 10px">
                <template v-if="noResources.selectedRowKeys.length>0">
                  {{ `已选 ${noResources.selectedRowKeys.length} 个资源` }}
                </template>
                <template v-else>
                  选择需要添加的资源
                </template>
              </a-col>
              <a-col :xs="18">
                <a-form-item label="资源">
                  <a-input v-model="noResources.query.key" placeholder="输入资源筛选"/>
                </a-form-item>
              </a-col>
              <a-col :xs="3">
                <span class="table-page-search-submitButtons">
                  <a-button shape="circle" @click="noResourcesHandleSearch"> <a-icon type="search" /></a-button>
                </span>
              </a-col>
              <a-col :xs="3" >
                <a-tooltip title="添加" placement="top">
                  <a-button
                    shape="circle"
                    icon="plus"
                    type="primary"
                    :disabled="noResources.selectedRowKeys.length===0"
                    :loading="noResources.addBtnLoading"
                    @click="handleAddUserRoles">
                  </a-button>
                </a-tooltip>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table
          :bordered="false"
          :columns="noResources.columns"
          :loading="noResources.loading"
          :size="tableSize"
          :dataSource="noResources.data"
          :pagination="noResources.pagination"
          :rowSelection="{selectedRowKeys: noResources.selectedRowKeys, onChange: noResourcesOnSelectChange}"
          :rowKey="record => record.id"
          @change="noResourcesHandleChange">
          <span slot="id" slot-scope="id, record">
            <span v-if="record.state === 'ON'" >{{ id }}</span>
            <span style="color:red" v-else >{{ id }}</span>
          </span>
        </a-table>
      </a-card>
    </a-col>
    <a-col :xs="24" :sm="24" :md="16">
      <a-card :title="haveResourcesTitle" :bordered="false" >
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="10">
              <a-col :xs="12" >
                <a-tooltip title="移除" placement="top">
                  <a-button
                    shape="circle"
                    icon="delete"
                    type="danger"
                    :disabled="haveResources.selectedRowKeys.length===0"
                    :loading="haveResources.delBtnLoading"
                    @click="handleDelUserRoles">
                  </a-button>
                </a-tooltip>
                <span v-if="haveResources.selectedRowKeys.length>0" style="margin-left:10px">
                  {{ `已选 ${haveResources.selectedRowKeys.length} 个资源` }}
                </span>
              </a-col>
              <a-col :xs="10" style="text-align: right">
                <a-form-item label="资源">
                  <a-input v-model="haveResources.query.key" placeholder="请输入资源筛选"/>
                </a-form-item>
              </a-col>
              <a-col :xs="2" >
                <span class="table-page-search-submitButtons">
                  <a-button shape="circle" @click="haveResourcesHandleSearch"> <a-icon type="search" /></a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table
          :bordered="false"
          :columns="haveResources.columns"
          :loading="haveResources.loading"
          :size="tableSize"
          :dataSource="haveResources.data"
          :rowSelection="{selectedRowKeys: haveResources.selectedRowKeys, onChange: haveResourcesOnSelectChange}"
          :pagination="haveResources.pagination"
          :rowKey="record => record.id"
          @change="haveResourcesHandleChange">
          <span slot="id" slot-scope="id, record">
            <span v-if="record.state === 'ON'" >{{ id }}</span>
            <span style="color:red" v-else >{{ id }}</span>
          </span>
        </a-table>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import { detail, listNoResources, listHaveResources, addRoleResources, delRoleResources } from '@/api/sys/role'
import { filterObj } from '@/utils/util'
export default {
  name: 'RoleConfigResources',
  data () {
    return {
      defaultSize: 'small',
      role: {
        id: '',
        name: '',
        intro: '',
        state: ''
      },
      noResources: {
        loading: false,
        columns: [
          { title: '名称', dataIndex: 'name', width: '60%' },
          { title: '编码', dataIndex: 'id', scopedSlots: { customRender: 'id' } }
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
      haveResources: {
        loading: false,
        columns: [
          { title: '名称', dataIndex: 'name' },
          { title: '编码', dataIndex: 'id', scopedSlots: { customRender: 'id' } },
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
    noResourcesFilter () {
      return filterObj(this.noResources.query)
    },
    haveResourcesFilter () {
      return filterObj(this.haveResources.query)
    },
    haveResourcesTitle () {
      return `${this.role.id} | ${this.role.name} | ${this.role.state === 'ON' ? '启用' : '禁用'}  | ${this.role.intro}`
    }
  },
  mounted () {
    this.loadRoleInfo()
    this.loadNoRolesData()
    this.loadHaveRolesData()
  },
  // created () {
  //   this.loadRoleInfo()
  //   this.loadNoRolesData()
  //   this.loadHaveRolesData()
  // },
  // beforeRouteLeave (to, from, next) {
  //   next()
  //   // 为了每次进入能更新数据，离开时销毁本组件
  //   this.$destroy()
  // },
  methods: {
    loadRoleInfo () {
      const roleId = this.$route.params.roleId
      detail(roleId).then((result) => {
        if (result.status) {
          this.role.id = result.data.id
          this.role.name = result.data.name
          this.role.intro = result.data.intro
          this.role.state = result.data.state
        }
      })
    },
    loadNoRolesData () {
      // 加载用户没有的角色列表
      const roleId = this.$route.params.roleId
      this.noResources.selectedRowKeys = []
      this.noResources.loading = true
      const body = {
        filter: this.noResourcesFilter,
        current: this.noResources.pagination.current,
        pageSize: this.noResources.pagination.pageSize
      }
      listNoResources(roleId, body).then((result) => {
        this.noResources.data = result.data.records
        this.noResources.pagination.current = result.data.current
        this.noResources.pagination.total = result.data.total
        this.noResources.pagination.pageSize = result.data.pageSize
      }).finally(() => {
        this.noResources.loading = false
      })
    },
    noResourcesOnSelectChange (selectedRowKeys) {
      // 表格复选框选中
      this.noResources.selectedRowKeys = selectedRowKeys
    },
    noResourcesHandleChange (pagination) {
      // 翻页
      this.noResources.pagination = pagination
      this.loadNoRolesData()
    },
    noResourcesHandleSearch () {
      // 查询
      this.noResources.pagination.current = 1
      this.noResources.pagination.total = 0
      this.loadNoRolesData()
    },
    handleAddUserRoles () {
      // 增加按钮
      this.noResources.addBtnLoading = true
      const roleId = this.$route.params.roleId
      addRoleResources(roleId, this.noResources.selectedRowKeys).then((result) => {
        if (result.status) {
          this.haveResources.pagination.current = 1
          this.haveResources.pagination.total = 0
          this.loadHaveRolesData()
          this.noResources.pagination.current = 1
          this.noResources.pagination.total = 0
          this.loadNoRolesData()
        }
      }).finally(() => {
        this.noResources.addBtnLoading = false
      })
    },
    loadHaveRolesData () {
      // 加载用户有的角色列表
      const roleId = this.$route.params.roleId
      this.haveResources.selectedRowKeys = []
      this.haveResources.loading = true
      const body = {
        filter: this.haveResourcesFilter,
        current: this.haveResources.pagination.current,
        pageSize: this.haveResources.pagination.pageSize
      }
      listHaveResources(roleId, body).then((result) => {
        this.haveResources.data = result.data.records
        this.haveResources.pagination.current = result.data.current
        this.haveResources.pagination.total = result.data.total
        this.haveResources.pagination.pageSize = result.data.pageSize
      }).finally(() => {
        this.haveResources.loading = false
      })
    },
    haveResourcesOnSelectChange (selectedRowKeys) {
      // 表格复选框选中
      this.haveResources.selectedRowKeys = selectedRowKeys
    },
    haveResourcesHandleChange (pagination) {
      // 翻页
      this.haveResources.pagination = pagination
      this.loadHaveRolesData()
    },
    haveResourcesHandleSearch () {
      // 查询
      this.haveResources.pagination.current = 1
      this.haveResources.pagination.total = 0
      this.loadHaveRolesData()
    },
    handleDelUserRoles () {
      // 删除按钮
      this.haveResources.addBtnLoading = true
      const roleId = this.$route.params.roleId
      delRoleResources(roleId, this.haveResources.selectedRowKeys).then((result) => {
        if (result.status) {
          this.noResources.pagination.current = 1
          this.noResources.pagination.total = 0
          this.loadNoRolesData()
          this.haveResources.pagination.current = 1
          this.haveResources.pagination.total = 0
          this.loadHaveRolesData()
        }
      }).finally(() => {
        this.noResources.addBtnLoading = false
      })
    }
  }
}
</script>
