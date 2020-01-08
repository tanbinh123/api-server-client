<template>
  <div class="table-page-search-wrapper">
    <a-form ref="searchForm" layout="inline" :form="form" >
      <a-row :gutter="20">
        <!--遍历前3个-->
        <a-col v-for="(item,i) in searchFields" v-if="i<3" :key="i" :md="6" :sm="24">
          <a-form-item :label="item.name">
            <a-input
              v-if="!item.type || item.type === 'input'"
              v-decorator="[item.code]"
              @pressEnter="handleSearch"
              :placeholder="`请输入${item.name}`"/>
            <a-select
              v-else-if="item.type === 'select'"
              v-decorator="[item.code]"
              :placeholder="`请选择${item.name}`"
            >
              <a-select-option
                v-for="(item,i) in item.list"
                :key="i"
                :value="item.value ? item.value : item.label">{{ item.label ? item.label : item.value }}
              </a-select-option>
            </a-select>
            <a-radio-group
              v-else-if="item.type === 'radio'"
              v-decorator="[item.code]"
            >
              <a-radio
                v-for="(item,i) in item.list"
                :key="i"
                :value="item.value ? item.value : item.label">
                {{ item.label ? item.label : item.value }}
              </a-radio>
            </a-radio-group>
            <template v-else>类型不支持</template>
          </a-form-item>
        </a-col>
        <!--遍历大于3个-->
        <template v-if="advanced">
          <a-col v-for="(item,i) in searchFields" v-if="i>=3" :key="i" :md="6" :sm="24">
            <a-form-item :label="item.name">
              <a-input
                v-if="!item.type || item.type === 'input'"
                v-decorator="[item.code]"
                @pressEnter="handleSearch"
                :placeholder="`请输入${item.name}`"/>
              <a-select
                v-else-if="item.type === 'select'"
                :placeholder="`请选择${item.name}`"
                v-decorator="[item.code]">
                <a-select-option
                  v-for="(item,i) in item.list"
                  :key="i"
                  :value="item.value ? item.value : item.label">{{ item.label ? item.label : item.value }}
                </a-select-option>
              </a-select>
              <a-radio-group
                v-else-if="item.type === 'radio'"
                v-decorator="[item.code]"
              >
                <a-radio
                  v-for="(item,i) in item.list"
                  :key="i"
                  :value="item.value ? item.value : item.label">
                  {{ item.label ? item.label : item.value }}
                </a-radio>
              </a-radio-group>
              <template v-else>类型不支持</template>
            </a-form-item>
          </a-col>
        </template>
        <a-col v-if="searchFields.length > 3" :md="!advanced && 6 || 24" :sm="24">
          <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
            <a-button type="primary" @click="handleSearch" style="margin-right: 10px">查询</a-button>
            <a-button @click="handleReset" style="margin-right: 10px">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-col>
        <a-col v-else :md="6" :sm="24" >
          <span class="table-page-search-submitButtons">
            <a-button @click="handleSearch" type="primary" style="margin-right: 10px">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { noEmptyFieldsObj } from '@/utils/util.curd'
export default {
  // 表格搜索框组件
  name: 'SearchForm',
  data () {
    return {
      form: this.$form.createForm(this),
      advanced: false
    }
  },
  props: {
    searchFields: {
      type: Array
    }
  },
  methods: {
    handleSearch () {
      let obj = this.form.getFieldsValue()
      obj = noEmptyFieldsObj(obj)
      console.log('search filter: ' + JSON.stringify(obj))
      this.$emit('search', obj)
    },
    handleReset () {
      this.form.resetFields()
      this.handleSearch()
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
