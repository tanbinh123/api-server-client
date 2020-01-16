<template>
  <div>
    <a-tag v-for="(tag) in tags" :key="tag" closable :afterClose="() => handleTagClose(tag)">
      {{ tag }}
    </a-tag>
    <a-input
      v-if="inputVisible"
      ref="input"
      v-model="inputValue"
      size="small"
      :style="{ width: inputWidth }"
      @blur="handleTagInputConfirm"
      @pressEnter="handleTagInputConfirm"
    />
    <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
      <a-icon type="plus" /> {{ btnText }}
    </a-tag>
  </div>
</template>
<script>
export default {
  name: 'TagsInput',
  data () {
    return {
      // 此处仅 子组件 ui控制
      inputVisible: false,
      inputValue: ''
    }
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    btnText: {
      type: String,
      default: '新标签'
    },
    inputWidth: {
      type: String,
      default: '100px'
    },
    confirmCallback: {
      type: Function,
      default: (tag) => {
        return true
      }
    },
    closeCallback: {
      type: Function,
      default: (tag) => {
        return true
      }
    }
  },
  created () {
    console.log('create')
  },
  methods: {
    showInput () {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    handleTagClose (removedTag) {
      const ret = this.tags.filter(tag => tag !== removedTag)
      this.closeCallback(removedTag)
      this.$emit('update:tags', ret)
    },
    handleTagInputConfirm: function () {
      const inputValue = this.inputValue.trim()
      if (inputValue && this.tags.indexOf(inputValue) === -1 && this.confirmCallback(inputValue)) {
        this.$emit('update:tags', [...this.tags, inputValue])
      }
      this.inputValue = ''
      this.inputVisible = false
    }
  }
}
</script>
<style scoped>

</style>
