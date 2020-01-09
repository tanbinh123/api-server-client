<template>
  <div>
    <a-tooltip v-if="unreadCount>99" >
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
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderNotice',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['unreadCount'])
  },
  methods: {
    handleClick () {
      this.$router.push({ name: 'MsgUnread' })
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
