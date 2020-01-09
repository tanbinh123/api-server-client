<template>
  <div style="background: red"></div>
</template>
<script>
// 此组件必须保证 整个生命周期 只存在一个实例
import { mapActions } from 'vuex'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'Interval', // 全局定时器数据
  data () {
    return {
      unreadMsg: {
        timer: null, // 必须存在
        interval: 5 * 60 * 1000
      }
    }
  },
  mounted () {
    if (this.unreadMsg.timer) {
      clearInterval(this.unreadMsg.timer)
    } else {
      this.unreadMsg.timer = setInterval(() => {
        if (Vue.ls.get(ACCESS_TOKEN)) {
          this.getUnreadCount()
        }
      }, this.unreadMsg.interval)
    }
  },
  destroyed () {
    clearInterval(this.unreadMsg.timer)
  },
  methods: {
    ...mapActions(['getUnreadCount'])
  }
}
</script>
