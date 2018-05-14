<template>
  <div id="app">
    <m-header></m-header>
    <router-view v-if="isLogin"/>
    <div id="container" v-else>
      <router-view/>
    </div>
    <m-footer></m-footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MHeader from '@/components/common/MHeader'
import MFooter from '@/components/common/MFooter'
export default {
  name: 'app',
  components:{
    MHeader,
    MFooter
  },
  computed:{
    ...mapState({
      isLogin : state => state.loginStatus.isLogin
    })
  }
}
</script>
