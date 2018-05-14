<template>
  <div>
    <p style="font-size:32px;margin:40px 0">登录账号</p>
    <Form :model="formLogin" :rules="rulesLogin" ref="formLogin" @keyup.enter.native="goLogin('formLogin')">
      <Form-item prop="phone_num">
        <Input v-model="formLogin.phone_num" placeholder="手机号／用户" :maxlength="11" size="large"
        @on-blur="fetchCode(formLogin.phone_num)">
          <div slot="prepend">
            <img src="~assets/img/icon_phone_selected.png" alt="">
          </div>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <Input v-model="formLogin.password" placeholder="请输入密码" :maxlength="16" size="large" type="password">
          <div slot="prepend">
            <img src="~assets/img/icon_password_selected.png" alt="">
          </div>
        </Input>
      </Form-item>
      <transition name="fade">
        <Form-item prop="validateCode" v-if="isShow">
          <Input v-model="formLogin.validate_code" placeholder="请输入图像验证码" :maxlength="6" size="large">
            <div slot="prepend">
              <img src="~assets/img/icon_code_selected.png" alt="">
            </div>
            <div slot="append">
              <div id="validate-photo" @click="fetchCode(formLogin.phone_num)"></div>
            </div>
          </Input>
        </Form-item>
      </transition>
    </Form>
    <div class="forget-login">
      <router-link to="/resetPwd">忘记密码？</router-link>
    </div>
    <div class="confirm-btn">
      <Button type="warning" @click.native="goLogin('formLogin')" long>立即登录</Button>
    </div>
    <div class="font-size-16px" style="margin:20px 0">
      <span>没有账户？</span>
      <a style="color:#FF8001" @click="$router.push('/register')">立即注册</a>
    </div>
  </div>
</template>
<script>
  import getStatus from '@/config/userStatus'
  export default {
    data(){
      return {
        isShow:false,
        formLogin:{
          phone_num:'',
          password:'',
          validate_code:''
        },
        rulesLogin:{
          phone_num:[
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          validate_code:[
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    metaInfo:{
      title:"登录"
    },
    methods:{
      fetchCode(phone_num){
        if(phone_num.replace(/\s+/g,'')){
          this.isShow = true
          this.$nextTick(()=> {
            let picCodeDom = document.getElementById('validate-photo')
            picCodeDom.style.background = `url(${BASEURL}kaptcha/getKaptcha?phone_num=${phone_num}&v=${Math.random()}) no-repeat center`
            picCodeDom.style.backgroundSize = '100% 100%'
          })
        }
      },
      goLogin(form){
        this.$refs[form].validate(valid => {
          if(valid){
            let redirectUrl = this.$route.query.redirect || '/mine'
            this.$post('user/login',this.formLogin).then(({model})=>{
              sessionStorage.setItem('phone_num',model.mobile)
              sessionStorage.setItem('user_id',model.user_status.userId)
              getStatus(model.user_status.userId).then(({status}) => {
                sessionStorage.setItem('status',status)
                this.$Message.success({
                  content:'登录成功！',
                  onClose:()=>{
                    this.$router.replace(redirectUrl)
                  }
                })
              }).catch(msg => Promise.reject({msg}))
            }).catch(({msg}) => this.$Message.warning(msg))
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .confirm-btn .ivu-btn {
    font-size: 16px;
  }
  #validate-photo{
    width: 80px;
    height: 34px;
    background-size: cover;
  }
  .forget-login{
    text-align: left;
    margin: 20px 0;
    a {
      color: #fff;
      font-size: 14px;
    }
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>

