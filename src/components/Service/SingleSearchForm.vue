<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form ref="searchForm" layout="inline" :form="form" >
        <a-row :gutter="20">
          <a-col v-if="$slots.head && desktop " :md="8" :xs="24">
            <div class="table-page-search-headButtons">
              <slot name="head"></slot>
            </div>
          </a-col>
          <a-col :md="desktop?5:7" :xs="24">
            <a-form-item label="查询字段">
              <a-select
                v-model="type"
                placeholder="请选择查询字段"
              >
                <a-select-option
                  v-for="(item,i) in searchFields"
                  :key="i"
                  :value="item.code">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="desktop?8:11" :xs="24">
            <a-form-item :label="activeItem.name">
              <a-input
                v-if="!activeItem.type || activeItem.type === 'input'"
                v-decorator="[activeItem.code]"
                @pressEnter="handleSearch"
                :placeholder="`请输入${activeItem.name}`"/>
              <a-select
                v-else-if="activeItem.type === 'select'"
                v-decorator="[activeItem.code]"
                :placeholder="`请选择${activeItem.name}`"
              >
                <a-select-option
                  v-for="(item,i) in activeItem.list"
                  :key="i"
                  :value="item.value ? item.value : item.label">{{ item.label ? item.label : item.value }}
                </a-select-option>
              </a-select>
              <a-date-picker
                v-else-if="activeItem.type === 'date'"
                :placeholder="`请选择${activeItem.name}`"
                v-decorator="[activeItem.code]" />
              <a-date-picker
                v-else-if="activeItem.type === 'datetime'"
                show-time
                :placeholder="`请选择${activeItem.name}`"
                v-decorator="[activeItem.code]" />
              <a-radio-group
                v-else-if="activeItem.type === 'radio'"
                v-decorator="[activeItem.code]"
              >
                <a-radio
                  v-for="(item,i) in activeItem.list"
                  :key="i"
                  :value="item.value ? item.value : item.label">
                  {{ item.label ? item.label : item.value }}
                </a-radio>
              </a-radio-group>
              <template v-else>类型不支持</template>
            </a-form-item>
          </a-col>
          <a-col :md="desktop?3:6" :xs="24" :class="{'align-right': desktop}" >
            <span class="table-page-search-submitButtons">
              <a-button @click="handleSearch" type="primary" >查询</a-button>
              <a-button @click="handleReset" >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div v-if="$slots.head && !desktop " class="table-operator">
      <slot name="head"></slot>
    </div>
  </div>
</template>
<script>
import { filterObj } from '@/utils/util'
import { mapGetters } from 'vuex'
import { DEVICE_TYPE } from '@/utils/device'
export default {
  // 单个表格搜素框组件
  name: 'SingleSearchForm',
  data () {
    return {
      form: this.$form.createForm(this),
      type: this.searchFields[0].code,
      dateFmt: 'YYYY-MM-DD',
      datetimeFmt: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  props: {
    searchFields: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['device']),
    activeItem () {
      // 根据 type 从 searchFields 挑选
      let activeItem
      const ary = this.searchFields
      for (let i = 0; i < ary.length; i++) {
        if (this.type === ary[i].code) {
          activeItem = ary[i]
          break
        }
      }
      return activeItem || ary[0]
    },
    desktop () {
      return this.device === DEVICE_TYPE.DESKTOP
    }
  },
  methods: {
    handleSearch () {
      // 日期类型数据处理
      let obj = this.form.getFieldsValue()
      if (this.activeItem.type === 'date') {
        obj[this.activeItem.code] = obj[this.activeItem.code].format(this.dateFmt)
      } else if (this.activeItem.type === 'datetime') {
        obj[this.activeItem.code] = obj[this.activeItem.code].format(this.datetimeFmt)
      }
      // 空格处理
      obj = filterObj(obj)
      console.log('search filter: ' + JSON.stringify(obj))
      this.$emit('search', obj)
    },
    handleReset () {
      const head = this.$slots.head
      console.log(head)
      this.form.resetFields()
      this.handleSearch()
    }
  }
}
</script>
<style scoped>
  .align-right {
    text-align: right;
  }
</style>
