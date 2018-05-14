<template>
  <div>
    <validate-header :status="status" :isLianlianUser="isLianlianUser" :isPassword="isPassword"></validate-header>
    <router-view :status="status" :isLianlianUser="isLianlianUser" :isPassword="isPassword" v-if="status != null"></router-view>
  </div>
</template>
<script>
import ValidateHeader from '../common/ValidateHeader'
import getStatus from '@/config/userStatus'
export default {
  data(){
    return {
      status:null,
      isLianlianUser:null,
      isPassword:null
    }
  },
  components:{
    ValidateHeader
  },
  watch:{
    '$route':'getUserStatus'
  },
  methods:{
    getUserStatus(){
      let userId = sessionStorage.getItem('user_id')
      userId && getStatus(userId).then(({status,isLianlianUser,isPassword}) => {
        this.status = status
        this.isLianlianUser = isLianlianUser
        this.isPassword = isPassword
      }).catch(msg => this.$Message.error(msg))
    }
  },
  created(){
    this.getUserStatus()
  }
}
</script>
