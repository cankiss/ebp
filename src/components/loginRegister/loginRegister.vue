<template>
  <div class="enterprise-login-wrapper">
    <div class="enterprise-login">
      <div class="login-form">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<style>
.enterprise-login-wrapper .ivu-input-group-prepend, .ivu-input-group-append{
  background-color: #6DB7F3;
  width: 36px;
}
.enterprise-login-wrapper .ivu-input-group-append{
  padding: 0;
}
.enterprise-login-wrapper .ivu-input{
  background-color: #6DB7F3;
  color: #fff;
}
.enterprise-login-wrapper .ivu-form-item{
  margin-bottom:36px;
}
</style>

<style lang="less" scoped>
  .enterprise-login-wrapper {
    background: url('~assets/img/bg_banner.png') no-repeat center;
    background-size: cover;
    height: 900px;
    width: 100%;
    margin-top: -1px;
    .enterprise-login {
      width: 1200px;
      margin: 0 auto;
      padding-top: 80px;
      color: #fff;
      display: flex;
      justify-content:flex-end;
      text-align: center;
      .login-form{
        width: 400px;
        margin-top: 40px;
        .forget-login{
          a {
            color:#FF8001;
          }
          text-align:left;
        }
        .confirm-btn{
          margin: 40px auto 20px;
          .ivu-btn{
            font-size: 16px;
          }
        }
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
</style>
