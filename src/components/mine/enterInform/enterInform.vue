<template>
    <div class="enterInform">
        <!-- 企业资料 -->
      <enterprise-info :status="status" v-if="status != null"></enterprise-info>
    </div>
</template>
<script>
import EnterpriseInfo from '~/validate/fillInForm'
import getStatus from '@/config/userStatus'
export default {
  data(){
    return {
      status:null
    }
  },
  components:{
    EnterpriseInfo
  },
  created(){
    this.getUserStatus()
  },
  methods:{
    getUserStatus(){
        let userId = sessionStorage.getItem('user_id')
        userId && getStatus(userId).then(({status,isLianlianUser,isPassword}) => {
          this.status = status
        }).catch(msg => this.$Message.error(msg))
      }
  }
}
</script>

<style>
    .enterInform{margin:30px 0;background:#fff;}
</style>
