<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
      <interval/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import Interval from '@/views/components/Interval'

export default {
  name: 'App',
  components: {
    Interval
  },
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {
  }
}
</script>
<style>
  #app {
    height: 100%;
  }
</style>
