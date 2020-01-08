<template>
  <div>
    <a-tooltip v-if="unreadCount>99" placement="bottomRight">
      <template slot="title">
        <span>未读 {{ unreadCount }} 条</span>
      </template>
      <span @click="handleClick" class="header-notice" ref="noticeRef">
        <a-badge :count="unreadCount" :overflowCount="99">
          <a-icon style="font-size: 16px; padding: 4px" type="bell" />
        </a-badge>
      </span>
    </a-tooltip>
    <span v-else @click="handleClick" class="header-notice" ref="noticeRef">
      <a-badge :count="unreadCount" :overflowCount="99">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'HeaderNotice',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['unreadCount'])
  },
  created () {
    this.getUnreadCount()
  },
  mounted () {
    // console.log('m')
    // 保证此定时器唯一性 noticeIcon 组件不应该被缓存
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.getUnreadCount()
      }, 5 * 60 * 1000) // 5分钟
    }
  },
  destroyed () {
    // console.log('d')
    // 保证此定时器唯一性 noticeIcon 组件不应该被缓存
    clearInterval(this.timer)
  },
  methods: {
    ...mapActions(['getUnreadCount']),
    handleClick () {
      alert('跳转到未读消息界面')
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
