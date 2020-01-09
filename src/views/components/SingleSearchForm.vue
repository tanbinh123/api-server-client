<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form ref="searchForm" layout="inline" :form="form" >
        <a-row :gutter="20">
          <a-col v-if="$slots.head && device === deviceType.DESKTOP " :md="8" :xs="{ span: 24 }">
            <div class="table-page-search-headButtons">
              <slot name="head"></slot>
            </div>
          </a-col>
          <a-col :md="device === deviceType.DESKTOP?5:7" :xs="24">
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
          <a-col :md="device === deviceType.DESKTOP?7:11" :xs="24">
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
              <a-date-picker
                v-else-if="item.type === 'date'"
                :placeholder="`请选择${item.name}`"
                v-decorator="[item.code]" />
              <a-date-picker
                v-else-if="item.type === 'datetime'"
                show-time
                :placeholder="`请选择${item.name}`"
                v-decorator="[item.code]" />
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
          <a-col :md="device === deviceType.DESKTOP?4:6" :xs="24" >
            <span class="table-page-search-submitButtons">
              <a-button @click="handleSearch" type="primary"  >查询</a-button>
              <a-button @click="handleReset" >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div v-if="$slots.head && device !== deviceType.DESKTOP " class="table-operator">
      <slot name="head"></slot>
    </div>
  </div>
</template>
<script>
import { noEmptyFieldsObj } from '@/utils/util.curd'
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
      datetimeFmt: 'YYYY-MM-DD HH:mm:ss',
      deviceType: DEVICE_TYPE
    }
  },
  props: {
    searchFields: {
      type: Array
    }
  },
  computed: {
    ...mapGetters(['device']),
    item () {
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
    }
  },
  methods: {
    handleSearch () {
      // 日期类型数据处理
      let obj = this.form.getFieldsValue()
      if (this.item.type === 'date') {
        obj[this.item.code] = obj[this.item.code].format(this.dateFmt)
      } else if (this.item.type === 'datetime') {
        obj[this.item.code] = obj[this.item.code].format(this.datetimeFmt)
      }
      // 空格处理
      obj = noEmptyFieldsObj(obj)
      console.log('search filter: ' + JSON.stringify(obj))
      this.$emit('search', obj)
    },
    handleReset () {
      this.form.resetFields()
      this.handleSearch()
    }
  }
}
</script>
