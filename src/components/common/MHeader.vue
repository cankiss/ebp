<template>
  <div>
    <div class="header-container" :style="{background:`url(${bg}) no-repeat center`}">
      <div class="header-wrapper">
        <div class="header-userInfo">
          <div>
            <img src="~assets/img/icon_phone.png" alt="">
            <p>客服电话：400-091-8080</p>
          </div>
          <div>
            <p>您好，</p>
            <div style="padding:0 10px" v-if="isUser">
              <Dropdown @on-click="onClick">
                <a href="javascript:void(0)" style="color:#fff">
                  {{ isUser | phoneHidden}}
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <Dropdown-menu slot="list">
                  <Dropdown-item name="/mine">我的账户</Dropdown-item>
                  <Dropdown-item name="/mine/payPwdReset" v-if="isReset">修改交易密码</Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
            </div>
            <p>欢迎来到亿宝贷企业借贷平台！</p>
            <div class="exit-btn clearfix" v-if='isUser'>
              <span></span>
              <a href="javascript:void(0)" style="color:#fff" @click="exit">退出</a>
            </div>
          </div>
        </div>
        <div class="header-logo">
          <img src="~assets/img/logo.png" alt="">
          <span></span>
          <img src="~assets/img/logo2.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import getStatus from '@/config/userStatus'
export default {
  data(){
    return {
      isUser:null,
      isReset:false,
      bg:require('@/assets/img/bg_toplogoline.png')
    }
  },
  watch:{
    '$route':'getUser'
  },
  methods:{
    getUser(){
      this.isUser = sessionStorage.getItem('phone_num')
      let userId = sessionStorage.getItem('user_id')
        userId && getStatus(userId).then(({status,isLianlianUser,isPassword}) => {
          this.isReset = isPassword === 2 ? false : true
        }).catch(msg => this.$Message.error(msg))
    },
    onClick(name){
      this.$router.push(name)
    },
    exit(){
      sessionStorage.clear()
      this.isUser = false
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less" scoped>
  .header-container{
    background-size: cover;
    height: 130px;
    width: 100%;
    .header-wrapper{
      width: 1200px;
      margin: 0 auto;
      .header-userInfo{
        color: #fff;
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        & div:nth-of-type(1) img{
          padding-right: 10px;
        }
        & > div {
          display: flex;
          justify-content:space-between;
        }
      }
      .header-logo{
        height: 80px;
        display: flex;
        align-items: center;
        span{
          height: 38px;
          width: 1px;
          background: #fff;
          margin: 0 15px
        }
        img:nth-of-type(2){
          margin-left: 10px;
        }
      }
      .exit-btn{
        span{
          margin: 0 10px;
        }
        span:nth-of-type(2){
          float: left;
        }
        span:nth-of-type(1){
          float: left;
          width: 1px;
          height: 20px;
          background: #fff;
        }
      }
    }
  }
</style>
